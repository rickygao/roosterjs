import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { createParagraph } from '../creators/createParagraph';
import { deleteSelectedSegments } from '../selection/deleteSelectedSegments';
import { normalizeModel } from './normalizeContentModel';
import { setSelection } from '../selection/setSelection';

/**
 * @internal
 */
export function mergeModel(majorModel: ContentModelDocument, sourceModel: ContentModelDocument) {
    const selection = deleteSelectedSegments(majorModel);

    normalizeModel(majorModel);
    setSelection(sourceModel);

    if (
        selection &&
        selection.segments.length == 1 &&
        selection.segments[0].segmentType == 'SelectionMarker'
    ) {
        const marker = selection.segments[0] as ContentModelSelectionMarker;
        const group = selection.path[0];
        let paragraph = selection.paragraph!;
        let isFirstBlock = true;

        sourceModel.blocks.forEach(block => {
            switch (block.blockType) {
                case 'Paragraph':
                    if (!isFirstBlock) {
                        paragraph = splitBlock(paragraph, marker, group);
                    }

                    let segmentIndex = paragraph.segments.indexOf(marker);
                    paragraph.segments.splice(segmentIndex, 0, ...block.segments);

                    break;

                case 'Table':
                case 'Divider':
                case 'Entity':
                    paragraph = splitBlock(paragraph, marker, group);

                    let blockIndex = group.blocks.indexOf(paragraph);

                    group.blocks.splice(blockIndex, 0, block);
                    break;

                case 'BlockGroup':
                    switch (block.blockGroupType) {
                        case 'General':
                        case 'ListItem':
                        case 'Quote':
                            paragraph = splitBlock(paragraph, marker, group);

                            let blockIndex = group.blocks.indexOf(paragraph);

                            group.blocks.splice(blockIndex, 0, block);
                            break;
                    }
                    break;
            }

            isFirstBlock = false;
        });
    }

    normalizeModel(majorModel);
}

function splitBlock(
    paragraph: ContentModelParagraph,
    marker: ContentModelSelectionMarker,
    group: ContentModelBlockGroup
) {
    let index = paragraph.segments.indexOf(marker);
    let paraIndex = group.blocks.indexOf(paragraph);
    const newParagraph = createParagraph(false /*isImplicit*/, paragraph.format);

    newParagraph.segments = paragraph.segments.splice(index);
    group.blocks.splice(paraIndex + 1, 0, newParagraph);

    return newParagraph;
}
