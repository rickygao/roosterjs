import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';

/**
 * @internal
 */
export interface TableSelectionContext {
    table: ContentModelTable;
    rowIndex: number;
    colIndex: number;
}

/**
 * @internal
 */
export interface ContentModelSelectionInfo {
    path: ContentModelBlockGroup[];
    segments?: ContentModelSegment[];
    block?: ContentModelBlock;
    tableContext?: TableSelectionContext;
}

/**
 * @internal
 */
export interface GetSelectionOptions {
    /**
     * When pass true, format holder (e.g. ContentModelListItem.formatHolder) is also included in selected segment in result.
     */
    includeListFormatHolder?: boolean;

    /**
     * When pass true, if selection is started from the end of a paragraph, or ended at the beginning of a paragraph,
     * those paragraphs are also included in result
     */
    includeUnmeaningfulSelection?: boolean;
}

/**
 * @internal
 */
export function getSelections(
    group: ContentModelDocument,
    option?: GetSelectionOptions
): ContentModelSelectionInfo[] {
    const result: ContentModelSelectionInfo[] = [];

    getSelectionsInternal([group], result);

    if (!option?.includeUnmeaningfulSelection) {
        handleUnmeaningfulSelections(result);
    }

    return result;
}

function getSelectionsInternal(
    path: ContentModelBlockGroup[],
    result: ContentModelSelectionInfo[],
    option?: GetSelectionOptions,
    tableContext?: TableSelectionContext,
    treatAllAsSelect?: boolean
) {
    const parent = path[0];
    let hasUnselectedSegment = false;

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                getSelectionsFromBlockGroup(
                    block,
                    path,
                    result,
                    option,
                    tableContext,
                    treatAllAsSelect
                );
                break;

            case 'Table':
                block.cells.forEach((row, rowIndex) => {
                    row.forEach((cell, colIndex) => {
                        if (cell.isSelected) {
                            addResult(result, { path, tableContext });
                        }

                        getSelectionsFromBlockGroup(
                            cell,
                            path,
                            result,
                            option,
                            {
                                table: block,
                                rowIndex,
                                colIndex,
                            },
                            treatAllAsSelect || cell.isSelected
                        );
                    });
                });
                break;

            case 'Paragraph':
                const segments: ContentModelSegment[] = [];

                block.segments.forEach(segment => {
                    if (segment.segmentType == 'General') {
                        getSelectionsFromBlockGroup(
                            segment,
                            path,
                            result,
                            option,
                            tableContext,
                            treatAllAsSelect
                        );
                    } else if (treatAllAsSelect || segment.isSelected) {
                        segments.push(segment);
                    } else {
                        hasUnselectedSegment = true;
                    }
                });

                if (segments.length > 0) {
                    addResult(result, { path, segments, block, tableContext });
                }

                break;

            case 'Divider':
            case 'Entity':
                if (block.isSelected) {
                    addResult(result, { path, block, tableContext });
                }

                break;
        }
    }

    if (
        option?.includeListFormatHolder &&
        parent.blockGroupType == 'ListItem' &&
        !hasUnselectedSegment
    ) {
        addResult(result, { path, segments: [parent.formatHolder], block: parent, tableContext });
    }
}

function addResult(result: ContentModelSelectionInfo[], source: ContentModelSelectionInfo) {
    result.push({
        ...source,
        path: [...source.path],
    });
}

function getSelectionsFromBlockGroup(
    group: ContentModelBlockGroup,
    path: ContentModelBlockGroup[],
    result: ContentModelSelectionInfo[],
    option?: GetSelectionOptions,
    tableContext?: TableSelectionContext,
    treatAllAsSelect?: boolean
) {
    path.unshift(group);
    getSelectionsInternal(path, result, option, tableContext, treatAllAsSelect);
    path.shift();
}

function handleUnmeaningfulSelections(result: ContentModelSelectionInfo[]) {
    // Remove tail paragraph if first selection marker is the only selection
    if (result.length > 1 && isOnlySelectionMarkerSelected(result, false /*checkFirstParagraph*/)) {
        result.pop();
    }

    // Remove head paragraph if first selection marker is the only selection
    if (result.length > 1 && isOnlySelectionMarkerSelected(result, true /*checkFirstParagraph*/)) {
        result.shift();
    }
}

function isOnlySelectionMarkerSelected(
    selections: ContentModelSelectionInfo[],
    checkFirstParagraph: boolean
): boolean {
    const selection = selections[checkFirstParagraph ? 0 : selections.length - 1];

    if (
        selection.block?.blockType == 'Paragraph' &&
        selection.segments &&
        selection.segments.length! > 0
    ) {
        const allSegments = selection.block.segments;
        const segment = selection.segments[0];

        return (
            selection.segments.length == 1 &&
            segment.segmentType == 'SelectionMarker' &&
            segment == allSegments[checkFirstParagraph ? allSegments.length - 1 : 0]
        );
    } else {
        return false;
    }
}
