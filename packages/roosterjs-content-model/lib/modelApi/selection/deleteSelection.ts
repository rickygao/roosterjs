import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelSelection } from './getSelections';
import { getOperationalBlocks } from '../common/getOperationalBlocks';

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

        const tableCells = getOperationalBlocks([selection, firstSelection], ['TableCell']);

        if (
            firstSelection.paragraph &&
            selection.paragraph != firstSelection.paragraph &&
            tableCells[0] != selection &&
            tableCells[1] != firstSelection &&
            tableCells[0] == tableCells[1]
        ) {
            arrayPush(firstSelection.paragraph.segments, paragraph.segments);
            paragraph.segments = [];
        }
    }
}
