import { arrayPush } from 'roosterjs-editor-dom';
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
    let lastParagraph: ContentModelParagraph | null = null;
    let lastPath: ContentModelBlockGroup[] | null = null;
    const selections = getSelections(model, { includeUnmeaningfulSelection: true });

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

                lastParagraph = block;
                lastPath = path;
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

    if (
        result &&
        lastParagraph &&
        lastPath &&
        canMergeParagraphs(result.paragraph, result.path, lastParagraph, lastPath)
    ) {
        arrayPush(result.paragraph.segments, lastParagraph.segments);
        lastParagraph.segments = [];
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

    return {
        marker,
        paragraph,
        path,
        tableContext,
    };
}

function canMergeParagraphs(
    para1: ContentModelParagraph,
    path1: ContentModelBlockGroup[],
    para2: ContentModelParagraph,
    path2: ContentModelBlockGroup[]
) {
    const tableCell1Index = getClosestAncestorBlockGroup(path1, ['TableCell']);
    const tableCell1 = path1[tableCell1Index];
    const tableCell2Index = getClosestAncestorBlockGroup(path2, ['TableCell']);
    const tableCell2 = path2[tableCell2Index];

    return para1 != para2 && tableCell1 == tableCell2;
}
