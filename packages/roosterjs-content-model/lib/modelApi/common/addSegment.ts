import { addBlock } from './addBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelParagraphFormat } from '../../publicTypes/format/ContentModelParagraphFormat';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { createParagraph } from '../creators/createParagraph';

/**
 * @internal
 */
export function addSegment(
    group: ContentModelBlockGroup,
    newSegment: ContentModelSegment,
    blockFormat?: ContentModelParagraphFormat
) {
    const lastBlock = group.blocks[group.blocks.length - 1];
    let paragraph: ContentModelParagraph;

    if (lastBlock?.blockType == 'Paragraph') {
        paragraph = lastBlock;
    } else {
        paragraph = createParagraph(true, blockFormat);
        addBlock(group, paragraph);
    }

    const lastSegment = paragraph.segments[paragraph.segments.length - 1];

    if (newSegment.segmentType == 'SelectionMarker') {
        if (!lastSegment || !lastSegment.isSelected) {
            paragraph.segments.push(newSegment);
        }
    } else {
        if (newSegment.isSelected && lastSegment?.segmentType == 'SelectionMarker') {
            paragraph.segments.pop();
        }

        paragraph.segments.push(newSegment);
    }
}
