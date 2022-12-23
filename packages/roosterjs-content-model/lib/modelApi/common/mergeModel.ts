import { addSegment } from './addSegment';
import { applyTableFormat } from '../table/applyTableFormat';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { createListItem } from '../creators/createListItem';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { createTableCell } from '../creators/createTableCell';
import { deleteSelection } from '../selection/deleteSelection';
import { findFirstSelectedTable } from '../selection/findFirstSelectedTable';
import { getClosestAncestorBlockGroup } from './getOperationalBlocks';
import { getSelections } from '../selection/getSelections';
import { normalizeModel } from './normalizeContentModel';
import { normalizeTable } from '../table/normalizeTable';
import { setSelection } from '../selection/setSelection';
import {
    ContentModelMarkerSelection,
    ContentModelSegmentsSelection,
} from '../../publicTypes/selection/ContentModelSelection';

/**
 * @internal
 */
export function mergeModel(target: ContentModelDocument, source: ContentModelDocument) {
    const selection = replaceSelectionsWithSelectionMarker(target);

    if (selection) {
        setSelection(source);
        source.blocks.forEach((block, i) => {
            switch (block.blockType) {
                case 'Paragraph':
                    mergeParagraph(selection, block, i == 0);
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
                        case 'Quote':
                            insertBlock(selection, block);
                            break;
                        case 'ListItem':
                            mergeList(selection, block);
                            break;
                    }
                    break;
            }
        });

        normalizeModel(target);
    }
}

function replaceSelectionsWithSelectionMarker(
    model: ContentModelDocument
): ContentModelMarkerSelection | null {
    const selections = getSelections(model);
    const firstSegmentsSelection = selections.filter(
        x => x.type == 'Segments'
    )[0] as ContentModelSegmentsSelection;
    let marker: ContentModelSelectionMarker | undefined;

    if (firstSegmentsSelection?.segments[0]) {
        const paragraph = firstSegmentsSelection.paragraph;
        const index = paragraph.segments.indexOf(firstSegmentsSelection.segments[0]);

        marker = createSelectionMarker(firstSegmentsSelection.segments[0].format);
        paragraph.segments.splice(index, 0, marker);
    }

    selections.forEach(selection => deleteSelection(selection, firstSegmentsSelection));

    normalizeModel(model);

    return marker
        ? {
              type: 'Marker',
              paragraph: firstSegmentsSelection.paragraph,
              marker: marker,
              path: selections[0].path,
          }
        : null;
}

function mergeParagraph(
    selection: ContentModelMarkerSelection,
    newPara: ContentModelParagraph,
    mergeToCurrentParagraph: boolean
) {
    const paragraph = mergeToCurrentParagraph ? selection.paragraph : splitParagraph(selection);
    const segmentIndex = paragraph.segments.indexOf(selection.marker);

    paragraph.segments.splice(segmentIndex, 0, ...newPara.segments);
}

function mergeTable(selection: ContentModelMarkerSelection, newTable: ContentModelTable) {
    const tableCell = getClosestAncestorBlockGroup<ContentModelTableCell>(selection, ['TableCell']);
    let table: ContentModelTable | undefined;

    if (tableCell && (table = findFirstSelectedTable([selection])) && table.cells[0]) {
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
                const newCell = newTable.cells[i][j];

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

                table.cells[rowIndex + i][columnIndex + j] = newCell;

                if (i == 0 && j == 0) {
                    addSegment(newCell, createSelectionMarker());
                }
            }
        }

        normalizeTable(table);
        applyTableFormat(table, undefined /*newFormat*/, true /*keepCellShade*/);
    } else {
        insertBlock(selection, newTable);
    }
}

function mergeList(selection: ContentModelMarkerSelection, newList: ContentModelListItem) {
    splitParagraph(selection);

    const listItem = getClosestAncestorBlockGroup<ContentModelListItem>(selection, ['ListItem']);
    const index = listItem ? selection.path.indexOf(listItem) : -1;
    const listParent = selection.path[index + 1]; // It is ok here when index is -1, that means there is no list and we just insert a new paragraph and use path[0] as its parent
    const blockIndex = listParent.blocks.indexOf(listItem || selection.paragraph);

    listParent.blocks.splice(blockIndex, 0, newList);

    if (listItem) {
        listItem?.levels.forEach((level, i) => {
            newList.levels[i] = { ...level };
        });
    }
}

function splitParagraph(selection: ContentModelMarkerSelection) {
    const segmentIndex = selection.paragraph.segments.indexOf(selection.marker);
    const paraIndex = selection.path[0].blocks.indexOf(selection.paragraph);
    const newParagraph = createParagraph(false /*isImplicit*/, selection.paragraph.format);

    newParagraph.segments = selection.paragraph.segments.splice(segmentIndex);
    selection.path[0].blocks.splice(paraIndex + 1, 0, newParagraph);

    const listItem = getClosestAncestorBlockGroup<ContentModelListItem>(
        selection,
        ['ListItem'],
        ['Quote', 'TableCell']
    );

    if (listItem) {
        const index = selection.path.indexOf(listItem);
        const listParent = index >= 0 ? selection.path[index + 1] : null;
        const blockIndex = listParent ? listParent.blocks.indexOf(listItem) : -1;

        if (blockIndex >= 0 && listParent) {
            const newListItem = createListItem(listItem.levels, listItem.formatHolder.format);

            newListItem.blocks = listItem.blocks.splice(paraIndex + 1);
            listParent.blocks.splice(blockIndex + 1, 0, newListItem);

            selection.path[index] = newListItem;
        }
    }

    selection.paragraph = newParagraph;

    return newParagraph;
}

function insertBlock(selection: ContentModelMarkerSelection, block: ContentModelBlock) {
    const newPara = splitParagraph(selection);
    const blockIndex = selection.path[0].blocks.indexOf(newPara);

    selection.path[0].blocks.splice(blockIndex, 0, block);
}
