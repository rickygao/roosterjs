import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelSelection } from './getSelections';
import { getClosestAncestorBlockGroup } from '../common/getOperationalBlocks';

/**
 * @internal
 */
export function deleteSelection(
    selection: ContentModelSelection,
    firstSelection?: ContentModelSelection
) {
    const { paragraph, segments, path } = selection;

    if (paragraph) {
        segments.forEach(segment =>
            paragraph.segments.splice(paragraph.segments.indexOf(segment), 1)
        );

        if (firstSelection) {
            const cell1 = getClosestAncestorBlockGroup(selection, ['TableCell']);
            const cell2 = getClosestAncestorBlockGroup(firstSelection, ['TableCell']);

            if (
                firstSelection.paragraph &&
                paragraph != firstSelection.paragraph &&
                ((cell1 && cell2 && cell1 == cell2) || (!cell1 && !cell2))
            ) {
                arrayPush(firstSelection.paragraph.segments, paragraph.segments);
                paragraph.segments = [];
            }
        }
    } else if (segments.length == 1 && segments[0].segmentType == 'SelectionMarker' && path[0]) {
        const blocks = path[0].blocks;

        const block = blocks.filter(
            x => x.blockType == 'Divider' && x.selectionMarker == segments[0]
        )[0];

        if (block) {
            blocks.splice(blocks.indexOf(block), 1);
        }
    }
}
