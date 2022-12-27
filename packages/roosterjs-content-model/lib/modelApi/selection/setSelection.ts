import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { Selectable } from '../../publicTypes/selection/Selectable';

/**
 * @internal
 */
export function setSelection(group: ContentModelBlockGroup, start?: Selectable, end?: Selectable) {
    setSelectionToBlockGroup(group, false /*isInSelection*/, start || null, end || null);
}

/**
 * @internal
 */
export function setSelectionToBlockGroup(
    group: ContentModelBlockGroup,
    isInSelection: boolean,
    start: Selectable | null,
    end: Selectable | null
): boolean {
    return handleSelection(isInSelection, group, start, end, isInSelection => {
        if (group.blockGroupType == 'TableCell' || isGeneralSegment(group)) {
            setIsSelected(group, isInSelection);
        }

        group.blocks.forEach(block => {
            isInSelection = setSelectionToBlock(block, isInSelection, start, end);
        });

        return isInSelection;
    });
}

/**
 * @internal
 */
export function setSelectionToBlock(
    block: ContentModelBlock,
    isInSelection: boolean,
    start: Selectable | null,
    end: Selectable | null
) {
    switch (block.blockType) {
        case 'BlockGroup':
            return setSelectionToBlockGroup(block, isInSelection, start, end);

        case 'Table':
            block.cells.forEach(row =>
                row.forEach(cell => {
                    isInSelection = setSelectionToBlockGroup(cell, isInSelection, start, end);
                })
            );

            return isInSelection;

        case 'Divider':
        case 'Entity':
            return handleSelection(isInSelection, block, start, end, isInSelection => {
                if (isInSelection) {
                    block.isSelected = true;
                } else {
                    delete block.isSelected;
                }

                return isInSelection;
            });

        case 'Paragraph':
            const segmentsToDelete: number[] = [];

            block.segments.forEach((segment, i) => {
                isInSelection = handleSelection(
                    isInSelection,
                    segment,
                    start,
                    end,
                    isInSelection => {
                        return setSelectionToSegment(
                            segment,
                            isInSelection,
                            segmentsToDelete,
                            start,
                            end,
                            i
                        );
                    }
                );
            });

            while (segmentsToDelete.length > 0) {
                const index = segmentsToDelete.pop()!;
                block.segments.splice(index, 1);
            }

            return isInSelection;

        default:
            return isInSelection;
    }
}

/**
 * @internal
 */
export function setSelectionToSegment(
    segment: ContentModelSegment,
    isInSelection: boolean,
    segmentsToDelete: number[],
    start: Selectable | null,
    end: Selectable | null,
    i: number
) {
    switch (segment.segmentType) {
        case 'SelectionMarker':
            if (!isInSelection) {
                segmentsToDelete.push(i);
            }
            return isInSelection;

        case 'General':
            setIsSelected(segment, isInSelection);
            return setSelectionToBlockGroup(segment, isInSelection, start, end);

        case 'Image':
            setIsSelected(segment, isInSelection);
            segment.isSelectedAsImageSelection = start == segment && end == segment;
            return isInSelection;
        default:
            setIsSelected(segment, isInSelection);
            return isInSelection;
    }
}

function isGeneralSegment(group: ContentModelBlockGroup): group is ContentModelGeneralSegment {
    return (
        group.blockGroupType == 'General' &&
        (<ContentModelGeneralSegment>group).segmentType == 'General'
    );
}

function setIsSelected(selectable: Selectable, value: boolean) {
    if (value) {
        selectable.isSelected = true;
    } else {
        delete selectable.isSelected;
    }

    return value;
}

function handleSelection(
    isInSelection: boolean,
    model: ContentModelBlockGroup | ContentModelBlock | ContentModelSegment,
    start: Selectable | null,
    end: Selectable | null,
    callback: (isInSelection: boolean) => boolean
) {
    isInSelection = isInSelection || model == start;
    isInSelection = callback(isInSelection);
    return isInSelection && !!end && model != end;
}
