import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSelection } from '../../publicTypes/selection/ContentModelSelection';

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
            type: 'FormatHolder',
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
