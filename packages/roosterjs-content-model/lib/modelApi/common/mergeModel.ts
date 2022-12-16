import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelSelection } from '../selection/getSelections';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { createListItem } from '../creators/createListItem';
import { createParagraph } from '../creators/createParagraph';
import { deleteSelectedSegments } from '../selection/deleteSelectedSegments';
import { getOperationalBlocks } from './getOperationalBlocks';
import { isBlockGroupOfType } from './isBlockGroupOfType';
import { normalizeModel } from './normalizeContentModel';
import { setSelection } from '../selection/setSelection';

/**
 * @internal
 */
export function mergeModel(majorModel: ContentModelDocument, sourceModel: ContentModelDocument) {
    let selection = deleteSelectedSegments(majorModel);

    normalizeModel(majorModel);
    setSelection(sourceModel);

    if (
        selection &&
        selection.segments.length == 1 &&
        selection.segments[0].segmentType == 'SelectionMarker'
    ) {
        const marker = selection.segments[0] as ContentModelSelectionMarker;
        let isFirstBlock = true;

        sourceModel.blocks.forEach(block => {
            switch (block.blockType) {
                case 'Paragraph':
                    const paragraph = isFirstBlock
                        ? selection!.paragraph
                        : splitParagraph(selection);
                    const segmentIndex = paragraph ? paragraph.segments.indexOf(marker) : -1;

                    paragraph?.segments.splice(segmentIndex, 0, ...block.segments);
                    break;

                case 'Table':
                case 'Divider':
                case 'Entity':
                    insertBlock(selection, block);
                    break;

                case 'BlockGroup':
                    switch (block.blockGroupType) {
                        case 'General':
                        case 'ListItem':
                        case 'Quote':
                            insertBlock(selection, block);
                            break;
                    }
                    break;
            }

            isFirstBlock = false;
        });
    }

    normalizeModel(majorModel);
}

function insertBlock(selection: ContentModelSelection | null, block: ContentModelBlock) {
    const paragraph = splitParagraph(selection);

    if (paragraph && selection) {
        let blockIndex = selection.path[0].blocks.indexOf(paragraph);

        selection.path[0].blocks.splice(blockIndex, 0, block);
        return paragraph;
    } else {
        return null;
    }
}

function splitParagraph(selection: ContentModelSelection | null) {
    if (
        selection &&
        selection.paragraph &&
        selection.segments.length == 1 &&
        selection.segments[0].segmentType == 'SelectionMarker'
    ) {
        const segmentIndex = selection.paragraph.segments.indexOf(selection.segments[0]);
        const paraIndex = selection.path[0].blocks.indexOf(selection.paragraph);
        const newParagraph = createParagraph(false /*isImplicit*/, selection.paragraph.format);

        newParagraph.segments = selection.paragraph.segments.splice(segmentIndex);
        selection.path[0].blocks.splice(paraIndex + 1, 0, newParagraph);

        const operationalBlock = getOperationalBlocks<ContentModelListItem>(
            [selection],
            ['ListItem'],
            ['Quote', 'TableCell']
        )[0];

        if (isBlockGroupOfType<ContentModelListItem>(operationalBlock, 'ListItem')) {
            const index = selection.path.indexOf(operationalBlock);
            const listParent = index >= 0 ? selection.path[index + 1] : null;
            const blockIndex = listParent ? listParent.blocks.indexOf(operationalBlock) : -1;

            if (blockIndex >= 0 && listParent) {
                const newListItem = createListItem(
                    operationalBlock.levels,
                    operationalBlock.formatHolder.format
                );

                newListItem.blocks = operationalBlock.blocks.splice(paraIndex + 1);
                listParent.blocks.splice(blockIndex + 1, 0, newListItem);

                selection.path[index] = newListItem;
            }
        }

        selection.paragraph = newParagraph;

        return newParagraph;
    } else {
        return null;
    }
}
