import { applyTableFormat } from '../table/applyTableFormat';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSelection, getSelections } from '../selection/getSelections';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { createListItem } from '../creators/createListItem';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { createTableCell } from '../creators/createTableCell';
import { deleteSelection } from '../selection/deleteSelection';
import { findFirstSelectedTable } from '../selection/findFirstSelectedTable';
import { getOperationalBlocks } from './getOperationalBlocks';
import { isBlockGroupOfType } from './isBlockGroupOfType';
import { normalizeModel } from './normalizeContentModel';
import { normalizeTable } from '../table/normalizeTable';
import { setSelection } from '../selection/setSelection';

interface MarkerSelection extends ContentModelSelection {
    paragraph: ContentModelParagraph;
    segments: [ContentModelSelectionMarker];
}

/**
 * @internal
 */
export function mergeModel(target: ContentModelDocument, source: ContentModelDocument) {
    const selection = replaceSelectionsWithSelectionMarker(target);

    setSelection(source);

    if (selection) {
        const marker = selection.segments[0];
        let isFirstBlock = true;

        source.blocks.forEach(block => {
            switch (block.blockType) {
                case 'Paragraph':
                    const paragraph = isFirstBlock
                        ? selection!.paragraph
                        : splitParagraph(selection);
                    const segmentIndex = paragraph.segments.indexOf(marker);

                    paragraph.segments.splice(segmentIndex, 0, ...block.segments);
                    break;

                case 'Divider':
                case 'Entity':
                    insertBlock(selection, block);
                    break;

                case 'Table':
                    mergeTable(selection, block);
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

        normalizeModel(target);
    }
}

function replaceSelectionsWithSelectionMarker(model: ContentModelDocument): MarkerSelection | null {
    const selections = getSelections(model);
    const firstPara = selections[0]?.paragraph;
    const firstSegment = selections[0]?.segments[0];

    if (!firstPara || !firstSegment) {
        return null;
    }

    const marker = createSelectionMarker(firstSegment.format);

    firstPara.segments.splice(firstPara.segments.indexOf(firstSegment), 0, marker);
    selections.forEach(selection => deleteSelection(selection, selections[0]));

    normalizeModel(model);

    return {
        paragraph: firstPara,
        path: selections[0].path,
        segments: [marker],
    };
}

function insertBlock(selection: MarkerSelection, block: ContentModelBlock) {
    const paragraph = splitParagraph(selection);

    let blockIndex = selection.path[0].blocks.indexOf(paragraph);

    selection.path[0].blocks.splice(blockIndex, 0, block);
}

function splitParagraph(selection: MarkerSelection) {
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
}

function mergeTable(selection: MarkerSelection, newTable: ContentModelTable) {
    const tableCell = getOperationalBlocks<ContentModelTableCell>([selection], ['TableCell'])[0];
    let table: ContentModelTable | undefined;

    if (
        isBlockGroupOfType<ContentModelTableCell>(tableCell, 'TableCell') &&
        (table = findFirstSelectedTable([selection])) &&
        table.cells[0]
    ) {
        let rowIndex = -1;
        let columnIndex = -1;
        const rowCount = table.cells.length;
        const columnCount = table.cells[0].length;

        for (let i = 0; i < rowCount && rowIndex < 0; i++) {
            for (let j = 0; j < table.cells[i].length && columnIndex < 0; j++) {
                if (table.cells[i][j] == tableCell) {
                    rowIndex = i;
                    columnIndex = j;
                }
            }
        }

        for (let i = 0; i < newTable.cells.length; i++) {
            for (let j = 0; j < newTable.cells[i].length; j++) {
                if (i == 0 && columnIndex + j >= columnCount) {
                    for (let k = 0; k < rowIndex; k++) {
                        const leftCell = table.cells[k]?.[columnIndex + j - 1];
                        table.cells[k][columnIndex + j] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            leftCell?.isHeader,
                            leftCell?.format
                        );
                    }
                }
                if (j == 0 && rowIndex + i >= rowCount) {
                    if (!table.cells[rowIndex + i]) {
                        table.cells[rowIndex + i] = [];
                    }

                    for (let k = 0; k < columnIndex; k++) {
                        const aboveCell = table.cells[rowIndex + i - 1]?.[k];
                        table.cells[rowIndex + i][k] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            false /*isHeader*/,
                            aboveCell?.format
                        );
                    }
                }

                table.cells[rowIndex + i][columnIndex + j] = newTable.cells[i][j];
            }
        }

        normalizeTable(table);
        applyTableFormat(table, undefined /*newFormat*/, true /*keepCellShade*/);
    } else {
        insertBlock(selection, newTable);
    }
}
