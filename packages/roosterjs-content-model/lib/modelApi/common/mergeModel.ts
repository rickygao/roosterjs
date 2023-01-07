import { addSegment } from './addSegment';
import { applyTableFormat } from '../table/applyTableFormat';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createListItem } from '../creators/createListItem';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { createTableCell } from '../creators/createTableCell';
import { deleteSelection } from '../selection/deleteSelections';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { InsertPosition } from '../../publicTypes/selection/InsertPosition';
import { normalizeContentModel } from './normalizeContentModel';
import { normalizeTable } from '../table/normalizeTable';

/**
 * @internal
 */
export function mergeModel(target: ContentModelDocument, source: ContentModelDocument) {
    const insertPosition = deleteSelection(target);

    if (insertPosition) {
        for (let i = 0; i < source.blocks.length; i++) {
            const block = source.blocks[i];

            switch (block.blockType) {
                case 'Paragraph':
                    mergeParagraph(insertPosition, block, i == 0);
                    break;

                case 'Divider':
                case 'Entity':
                    insertBlock(insertPosition, block);
                    break;

                case 'Table':
                    mergeTable(insertPosition, block, source);
                    break;

                case 'BlockGroup':
                    switch (block.blockGroupType) {
                        case 'General':
                        case 'Quote':
                            insertBlock(insertPosition, block);
                            break;
                        case 'ListItem':
                            mergeList(insertPosition, block);
                            break;
                    }
                    break;
            }
        }
    }

    normalizeContentModel(target);
}

function mergeParagraph(
    markerPosition: InsertPosition,
    newPara: ContentModelParagraph,
    mergeToCurrentParagraph: boolean
) {
    const { paragraph, marker } = markerPosition;
    const newParagraph = mergeToCurrentParagraph ? paragraph : splitParagraph(markerPosition);
    const segmentIndex = newParagraph.segments.indexOf(marker);

    if (segmentIndex >= 0) {
        newParagraph.segments.splice(segmentIndex, 0, ...newPara.segments);
    }
}

function mergeTable(
    markerPosition: InsertPosition,
    newTable: ContentModelTable,
    source: ContentModelDocument
) {
    const { tableContext } = markerPosition;

    if (tableContext && source.blocks.length == 1 && source.blocks[0] == newTable) {
        const { table, colIndex, rowIndex } = tableContext;
        for (let i = 0; i < newTable.cells.length; i++) {
            for (let j = 0; j < newTable.cells[i].length; j++) {
                const newCell = newTable.cells[i][j];

                if (i == 0 && colIndex + j >= table.cells[0].length) {
                    for (let k = 0; k < rowIndex; k++) {
                        const leftCell = table.cells[k]?.[colIndex + j - 1];
                        table.cells[k][colIndex + j] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            leftCell?.isHeader,
                            leftCell?.format
                        );
                    }
                }

                if (j == 0 && rowIndex + i >= table.cells.length) {
                    if (!table.cells[rowIndex + i]) {
                        table.cells[rowIndex + i] = [];
                    }

                    for (let k = 0; k < colIndex; k++) {
                        const aboveCell = table.cells[rowIndex + i - 1]?.[k];
                        table.cells[rowIndex + i][k] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            false /*isHeader*/,
                            aboveCell?.format
                        );
                    }
                }

                table.cells[rowIndex + i][colIndex + j] = newCell;

                if (i == 0 && j == 0) {
                    addSegment(newCell, createSelectionMarker());
                }
            }
        }

        normalizeTable(table);
        applyTableFormat(table, undefined /*newFormat*/, true /*keepCellShade*/);
    } else {
        insertBlock(markerPosition, newTable);
    }
}

function mergeList(markerPosition: InsertPosition, newList: ContentModelListItem) {
    splitParagraph(markerPosition);

    const { path, paragraph } = markerPosition;

    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem']);
    const listItem = path[listItemIndex] as ContentModelListItem;
    const listParent = path[listItemIndex + 1]; // It is ok here when index is -1, that means there is no list and we just insert a new paragraph and use path[0] as its parent
    const blockIndex = listParent.blocks.indexOf(listItem || paragraph);

    if (blockIndex >= 0) {
        listParent.blocks.splice(blockIndex, 0, newList);
    }

    if (listItem) {
        listItem?.levels.forEach((level, i) => {
            newList.levels[i] = { ...level };
        });
    }
}

function splitParagraph(markerPosition: InsertPosition) {
    const { paragraph, marker, path } = markerPosition;
    const segmentIndex = paragraph.segments.indexOf(marker);
    const paraIndex = path[0].blocks.indexOf(paragraph);
    const newParagraph = createParagraph(false /*isImplicit*/, paragraph.format);

    if (segmentIndex >= 0) {
        newParagraph.segments = paragraph.segments.splice(segmentIndex);
    }

    if (paraIndex >= 0) {
        path[0].blocks.splice(paraIndex + 1, 0, newParagraph);
    }

    const listItemIndex = getClosestAncestorBlockGroupIndex(
        path,
        ['ListItem'],
        ['Quote', 'TableCell']
    );
    const listItem = path[listItemIndex] as ContentModelListItem;

    if (listItem) {
        const listParent = listItemIndex >= 0 ? path[listItemIndex + 1] : null;
        const blockIndex = listParent ? listParent.blocks.indexOf(listItem) : -1;

        if (blockIndex >= 0 && listParent) {
            const newListItem = createListItem(listItem.levels, listItem.formatHolder.format);

            if (paraIndex >= 0) {
                newListItem.blocks = listItem.blocks.splice(paraIndex + 1);
            }

            if (blockIndex >= 0) {
                listParent.blocks.splice(blockIndex + 1, 0, newListItem);
            }

            path[listItemIndex] = newListItem;
        }
    }

    markerPosition.paragraph = newParagraph;

    return newParagraph;
}

function insertBlock(markerPosition: InsertPosition, block: ContentModelBlock) {
    const { path } = markerPosition;
    const newPara = splitParagraph(markerPosition);
    const blockIndex = path[0].blocks.indexOf(newPara);

    if (blockIndex >= 0) {
        path[0].blocks.splice(blockIndex, 0, block);
    }
}
