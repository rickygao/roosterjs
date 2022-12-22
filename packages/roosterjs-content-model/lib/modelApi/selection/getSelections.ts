import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { Selectable } from '../../publicTypes/selection/Selectable';

/**
 * @internal
 */
export type ContentModelSelectionType =
    /**
     * A bunch of segments under a given paragraph
     */
    | 'Segments'

    /**
     * Single selection marker under a paragraph, mostly used for insert new content
     */
    | 'Marker'

    /**
     * The list selection marker for a list item, used for change format of list number
     */
    | 'ListNumber'

    /**
     * Whole block selection (divider, entity, ...), used for delete selected content
     */
    | 'Block';

/**
 * @internal
 */
export interface ContentModelSelectionBase<T extends ContentModelSelectionType> {
    /**
     * Type of this selection
     */
    type: T;

    /**
     * A path that combines all parents of ContentModelBlockGroup of this paragraph. First element is the direct parent group, then next
     * one is first one's parent group, until last one, the root document group.
     * e.g. A table contains a list with a paragraph, like:
     * ContentModelDocument
     *   \ ContentModelTable
     *       \ ContentModelListItem
     *           \ ContentModelParagraph
     * Then the path will be:
     * [ContentModelListItem, ContentModelDocument]
     */
    path: ContentModelBlockGroup[];
}

/**
 * @internal
 */
export interface ContentModelSegmentsSelection extends ContentModelSelectionBase<'Segments'> {
    /**
     * Paragraph that contains selection.
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    paragraph: ContentModelParagraph;

    /**
     * Selected segments
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    segments: ContentModelSegment[];
}

/**
 * @internal
 */
export interface ContentModelMarkerSelection extends ContentModelSelectionBase<'Marker'> {
    /**
     * Paragraph that contains selection.
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    paragraph: ContentModelParagraph;

    /**
     * Selection marker the insertion point
     */
    marker: ContentModelSelectionMarker;
}

/**
 * @internal
 */
export interface ContentModelListNumberSelection extends ContentModelSelectionBase<'ListNumber'> {
    /**
     * Selection marker the selected list item
     */
    formatHolder: ContentModelSelectionMarker;
}

/**
 * @internal
 */
export interface ContentModelBlockSelection extends ContentModelSelectionBase<'Block'> {
    /**
     * The selected block
     */
    block: ContentModelBlock & Selectable;
}

/**
 * @internal
 */
export type ContentModelSelection =
    | ContentModelSegmentsSelection
    | ContentModelMarkerSelection
    | ContentModelListNumberSelection
    | ContentModelBlockSelection;

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
    includeUnmeaningfulSelectedParagraph?: boolean;
}

/**
 * @internal
 */
export function getSelections(
    group: ContentModelBlockGroup,
    options?: GetSelectionOptions
): ContentModelSelection[] {
    const result: ContentModelSelection[] = [];

    getSelectionsInternal([group], result, options);
    handleUnmeaningfulSelections(options, result);

    return result;
}

function handleUnmeaningfulSelections(
    options: GetSelectionOptions | undefined,
    result: ContentModelSelection[]
) {
    if (!options || !options.includeUnmeaningfulSelectedParagraph) {
        // Remove tail paragraph if first selection marker is the only selection
        if (
            result.length > 1 &&
            isOnlySelectionMarkerSelected(result, false /*checkFirstParagraph*/)
        ) {
            result.pop();
        }

        // Remove head paragraph if first selection marker is the only selection
        if (
            result.length > 1 &&
            isOnlySelectionMarkerSelected(result, true /*checkFirstParagraph*/)
        ) {
            result.shift();
        }
    }
}

function isOnlySelectionMarkerSelected(
    selections: ContentModelSelection[],
    checkFirstParagraph: boolean
): boolean {
    const selection = selections[checkFirstParagraph ? 0 : selections.length - 1];

    switch (selection.type) {
        case 'Marker':
            return true;

        case 'Segments':
            const allSegments = selection.paragraph.segments;
            const segment = selection.segments[0];

            return (
                selection.segments.length == 1 &&
                segment.segmentType == 'SelectionMarker' &&
                segment == allSegments[checkFirstParagraph ? allSegments.length - 1 : 0]
            );

        default:
            return false;
    }
}

function getSelectionsInternal(
    path: ContentModelBlockGroup[],
    result: ContentModelSelection[],
    options?: GetSelectionOptions,
    treatAllAsSelect?: boolean
) {
    const parent = path[0];
    let hasUnselectedSegment = false;
    let startingLength = result.length;

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                getSelectedParagraphFromBlockGroup(block, path, result, options, treatAllAsSelect);
                break;

            case 'Table':
                block.cells.forEach(row => {
                    row.forEach(cell => {
                        getSelectedParagraphFromBlockGroup(
                            cell,
                            path,
                            result,
                            options,
                            treatAllAsSelect || cell.isSelected
                        );
                    });
                });
                break;

            case 'Paragraph':
                const selectedSegments: ContentModelSegment[] = [];

                block.segments.forEach(segment => {
                    if (segment.segmentType == 'General') {
                        getSelectedParagraphFromBlockGroup(
                            segment,
                            path,
                            result,
                            options,
                            treatAllAsSelect
                        );
                    } else if (treatAllAsSelect || segment.isSelected) {
                        selectedSegments.push(segment);
                    } else {
                        hasUnselectedSegment = true;
                    }
                });

                if (selectedSegments.length > 0) {
                    result.push({
                        type: 'Segments',
                        paragraph: block,
                        segments: selectedSegments,
                        path: [...path],
                    });
                }

                break;

            case 'Divider':
            case 'Entity':
                if (block.isSelected) {
                    result.push({
                        type: 'Block',
                        block: block,
                        path: [...path],
                    });
                }

                break;
        }
    }

    if (
        parent.blockGroupType == 'ListItem' &&
        !hasUnselectedSegment &&
        options?.includeListFormatHolder
    ) {
        result.splice(startingLength, 0 /*deleteCount*/, {
            type: 'ListNumber',
            formatHolder: parent.formatHolder,
            path: [...path],
        });
    }
}

function getSelectedParagraphFromBlockGroup(
    group: ContentModelBlockGroup,
    path: ContentModelBlockGroup[],
    result: ContentModelSelection[],
    options?: GetSelectionOptions,
    treatAllAsSelect?: boolean
) {
    path.unshift(group);
    getSelectionsInternal(path, result, options, treatAllAsSelect);
    path.shift();
}
