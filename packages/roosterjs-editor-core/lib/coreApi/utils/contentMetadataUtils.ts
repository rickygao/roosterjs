import { contains, createRange, getSelectionPath, queryElements } from 'roosterjs-editor-dom';
import {
    ContentMetadata,
    EditorCore,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export function rangeExToMetadata(
    root: HTMLElement,
    rangeEx: SelectionRangeEx,
    isDarkMode: boolean
): ContentMetadata | null {
    switch (rangeEx?.type) {
        case SelectionRangeTypes.TableSelection:
            return {
                type: SelectionRangeTypes.TableSelection,
                tableId: rangeEx.table.id,
                isDarkMode: !!isDarkMode,
                ...rangeEx.coordinates!,
            };
        case SelectionRangeTypes.ImageSelection:
            return {
                type: SelectionRangeTypes.ImageSelection,
                imageId: rangeEx.image.id,
                isDarkMode: !!isDarkMode,
            };
        case SelectionRangeTypes.Normal:
            return {
                type: SelectionRangeTypes.Normal,
                isDarkMode: !!isDarkMode,
                start: [],
                end: [],
                ...(getSelectionPath(root, rangeEx.ranges[0]) || {}),
            };
    }

    return null;
}

/**
 * @internal
 */
export function metadataToRangeEx(
    contentDiv: HTMLElement,
    metadata: ContentMetadata
): SelectionRangeEx {
    if (metadata.type == SelectionRangeTypes.TableSelection) {
        const table = queryElements(contentDiv, '#' + metadata.tableId)[0] as HTMLTableElement;

        if (table) {
            return {
                type: SelectionRangeTypes.TableSelection,
                table: table,
                ranges: [],
                coordinates: {
                    firstCell: metadata.firstCell,
                    lastCell: metadata.lastCell,
                },
                areAllCollapsed: false,
            };
        }
    }

    if (metadata.type == SelectionRangeTypes.ImageSelection) {
        const image = queryElements(contentDiv, '#' + metadata.imageId)[0] as HTMLImageElement;

        if (image) {
            return {
                type: SelectionRangeTypes.ImageSelection,
                image: image,
                ranges: [createRange(image)],
                areAllCollapsed: false,
            };
        }
    }

    const ranges =
        metadata.type == SelectionRangeTypes.Normal
            ? [createRange(contentDiv, metadata.start, metadata.end)]
            : [];

    return {
        type: SelectionRangeTypes.Normal,
        ranges: ranges,
        areAllCollapsed: ranges.every(r => r.collapsed),
    };
}

/**
 * @internal
 */
export function selectRangeEx(
    core: EditorCore,
    rangeEx: SelectionRangeEx | null
): SelectionRangeEx | null {
    if (!core.lifecycle.shadowEditMetadata) {
        switch (rangeEx?.type) {
            case SelectionRangeTypes.TableSelection:
                if (contains(core.contentDiv, rangeEx.table)) {
                    core.domEvent.imageSelectionRange = core.api.selectImage(core, null);
                    core.domEvent.tableSelectionRange = core.api.selectTable(
                        core,
                        rangeEx.table,
                        rangeEx.coordinates
                    );
                    rangeEx = core.domEvent.tableSelectionRange;
                }
                break;
            case SelectionRangeTypes.ImageSelection:
                if (contains(core.contentDiv, rangeEx.image)) {
                    core.domEvent.tableSelectionRange = core.api.selectTable(core, null);
                    core.domEvent.imageSelectionRange = core.api.selectImage(core, rangeEx.image);
                    rangeEx = core.domEvent.imageSelectionRange;
                }
                break;
            case SelectionRangeTypes.Normal:
                core.domEvent.tableSelectionRange = core.api.selectTable(core, null);
                core.domEvent.imageSelectionRange = core.api.selectImage(core, null);

                if (contains(core.contentDiv, rangeEx.ranges[0])) {
                    core.api.selectRange(core, rangeEx.ranges[0]);
                } else {
                    rangeEx = null;
                }
                break;
        }

        return rangeEx;
    } else {
        return null;
    }
}
