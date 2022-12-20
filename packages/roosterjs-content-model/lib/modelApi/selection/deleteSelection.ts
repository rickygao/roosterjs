import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelSelection } from './getSelections';
import { getClosestAncestorBlockGroup } from '../common/getOperationalBlocks';

/**
 * @internal
 */
export function deleteSelection(
    selection: ContentModelSelection,
    firstSelection: ContentModelSelection
) {
    if (selection.paragraph) {
        const paragraph = selection.paragraph;

        selection.segments.forEach(segment =>
            paragraph.segments.splice(paragraph.segments.indexOf(segment), 1)
        );

        const cell1 = getClosestAncestorBlockGroup(selection, ['TableCell']);
        const cell2 = getClosestAncestorBlockGroup(firstSelection, ['TableCell']);

        if (
            firstSelection.paragraph &&
            selection.paragraph != firstSelection.paragraph &&
            ((cell1 && cell2 && cell1 == cell2) || (!cell1 && !cell2))
        ) {
            arrayPush(firstSelection.paragraph.segments, paragraph.segments);
            paragraph.segments = [];
        }
    }
}
