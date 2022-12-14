import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSelection, getSelections } from './getSelections';
import { createSelectionMarker } from '../creators/createSelectionMarker';

/**
 * @internal
 */
export function deleteSelectedSegments(model: ContentModelDocument): ContentModelSelection | null {
    const selections = getSelections(model);
    let firstSelection: ContentModelSelection | undefined;
    let lastSelection: ContentModelSelection | undefined;
    let resultSelectionMarker: ContentModelSegment | undefined;

    selections.forEach(selection => {
        if (selection.paragraph) {
            const paragraph = selection.paragraph;

            selection.segments.forEach(segment => {
                const index = paragraph.segments.indexOf(segment);

                if (!firstSelection) {
                    resultSelectionMarker = createSelectionMarker(segment.format);

                    paragraph.segments.splice(index, 1, resultSelectionMarker);
                    firstSelection = selection;
                } else {
                    paragraph.segments.splice(index, 1);
                }

                lastSelection = selection;
            });
        }
    });

    if (
        firstSelection &&
        lastSelection &&
        firstSelection != lastSelection &&
        firstSelection.path[0].blockGroupType != 'TableCell' &&
        lastSelection.path[0].blockGroupType != 'TableCell'
    ) {
        arrayPush(firstSelection.paragraph!.segments, lastSelection.paragraph!.segments);
        lastSelection.paragraph!.segments = [];
    }

    return firstSelection && resultSelectionMarker
        ? {
              path: firstSelection.path,
              paragraph: firstSelection.paragraph,
              segments: [resultSelectionMarker],
          }
        : null;
}
