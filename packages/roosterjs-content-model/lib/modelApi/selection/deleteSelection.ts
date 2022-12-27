import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { getClosestAncestorBlockGroup } from '../common/getOperationalBlocks';
import { getSelections, TableSelectionContext } from './getSelections';

export interface SelectionMarkerPosition {
    marker: ContentModelSelectionMarker;
    paragraph: ContentModelParagraph;
    path: ContentModelBlockGroup[];
    tableContext?: TableSelectionContext;
}

/**
 * @internal
 */
export function deleteSelection(model: ContentModelDocument): SelectionMarkerPosition | null {
    let result: SelectionMarkerPosition | null = null;
    const selections = getSelections(model, {
        includeUnmeaningfulSelection: true,
        ignoreContentUnderSelectedTableCell: true,
    });

    for (let i = 0; i < selections.length; i++) {
        const { path, segments, block, tableContext } = selections[i];

        if (segments) {
            if (segments.length > 0 && block?.blockType == 'Paragraph') {
                result =
                    result ||
                    insertMarker(
                        path,
                        path[0],
                        tableContext,
                        block,
                        -1 /*dummy, not used*/,
                        block.segments.indexOf(segments[0]),
                        segments[0].format
                    );

                segments.forEach(segment =>
                    block.segments.splice(block.segments.indexOf(segment), 1)
                );

                const blockIndex = path[0].blocks.indexOf(block);

                if (result && result.paragraph != block) {
                    const cell1 =
                        result.path[getClosestAncestorBlockGroup(result.path, ['TableCell'])];
                    const cell2 = path[getClosestAncestorBlockGroup(path, ['TableCell'])];

                    if (cell1 === cell2) {
                        result.paragraph.segments.splice(
                            result.paragraph.segments.indexOf(result.marker) + 1,
                            0,
                            ...block.segments
                        );
                        block.segments = [];
                    }
                }

                if (block.segments.length == 0) {
                    path[0].blocks.splice(blockIndex, 1);
                }
            }
        } else if (block) {
            const blocks = path[0].blocks;
            const blockIndex = blocks.indexOf(block);

            blocks.splice(blockIndex, 1);

            result =
                result ||
                insertMarker(
                    path,
                    path[0],
                    tableContext,
                    null /*paragraph*/,
                    blockIndex,
                    0 /*segmentIndex*/
                );
        } else if (tableContext) {
            const { table, colIndex, rowIndex } = tableContext;
            const cell = table.cells[rowIndex][colIndex];

            cell.blocks = [];
            result =
                result ||
                insertMarker(
                    path,
                    cell,
                    tableContext,
                    null /*paragraph*/,
                    0 /*blockIndex*/,
                    0 /*segmentIndex*/
                );
        }
    }

    return result;
}
function insertMarker(
    path: ContentModelBlockGroup[],
    parent: ContentModelBlockGroup,
    tableContext: TableSelectionContext | undefined,
    paragraph: ContentModelParagraph | null,
    blockIndex: number,
    segmentIndex: number,
    format?: ContentModelSegmentFormat
): SelectionMarkerPosition {
    const marker = createSelectionMarker(format);

    if (!paragraph) {
        paragraph = createParagraph(true /*isImplicit*/);
        parent.blocks.splice(blockIndex, 0, paragraph);
    }

    paragraph.segments.splice(segmentIndex, 0, marker);

    const result: SelectionMarkerPosition = {
        marker,
        paragraph,
        path,
    };

    if (tableContext) {
        result.tableContext = tableContext;
    }

    return result;
}
