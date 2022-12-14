import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';

/**
 * @internal
 */
export function clearSelection(group: ContentModelBlockGroup) {
    if (group.blockGroupType == 'TableCell' || isGeneralSegment(group)) {
        delete group.isSelected;
    }

    group.blocks.forEach(block => {
        switch (block.blockType) {
            case 'BlockGroup':
                clearSelection(block);
                break;

            case 'Table':
                block.cells.forEach(row => row.forEach(clearSelection));
                break;

            case 'Divider':
                delete block.isSelected;
                break;

            case 'Paragraph':
                for (let i = block.segments.length - 1; i >= 0; i--) {
                    const segment = block.segments[i];

                    switch (segment.segmentType) {
                        case 'SelectionMarker':
                            block.segments.splice(i, 1);
                            break;

                        case 'General':
                            clearSelection(segment);
                            break;

                        default:
                            delete segment.isSelected;
                    }
                }

                break;
        }
    });
}

function isGeneralSegment(group: ContentModelBlockGroup): group is ContentModelGeneralSegment {
    return (
        group.blockGroupType == 'General' &&
        (<ContentModelGeneralSegment>group).segmentType == 'General'
    );
}
