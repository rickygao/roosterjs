import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelSegmentsSelection, ContentModelSelection } from './getSelections';
import { getClosestAncestorBlockGroup } from '../common/getOperationalBlocks';

/**
 * @internal
 */
export function deleteSelection(
    selection: ContentModelSelection,
    firstSelection?: ContentModelSegmentsSelection
) {
    const { path } = selection;

    switch (selection.type) {
        case 'Segments':
            const { paragraph, segments } = selection;

            segments.forEach(segment =>
                paragraph.segments.splice(paragraph.segments.indexOf(segment), 1)
            );

            if (firstSelection) {
                const cell1 = getClosestAncestorBlockGroup(selection, ['TableCell']);
                const cell2 = getClosestAncestorBlockGroup(firstSelection, ['TableCell']);

                if (
                    paragraph != firstSelection.paragraph &&
                    ((cell1 && cell2 && cell1 == cell2) || (!cell1 && !cell2))
                ) {
                    arrayPush(firstSelection.paragraph.segments, paragraph.segments);
                    paragraph.segments = [];
                }
            }

            break;

        case 'Block':
            path[0].blocks.splice(path[0].blocks.indexOf(selection.block), 1);

            break;
    }
}
