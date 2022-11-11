import { contains } from 'roosterjs-editor-dom';
import { metadataToRangeEx } from './utils/contentMetadataUtils';
import {
    EditorCore,
    GetSelectionRangeEx,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Get current or cached selection range
 * @param core The EditorCore object
 * @returns A Range object of the selection range
 */
export const getSelectionRangeEx: GetSelectionRangeEx = (core: EditorCore) => {
    let result: SelectionRangeEx | null = null;
    if (core.lifecycle.shadowEditMetadata) {
        return metadataToRangeEx(core.contentDiv, core.lifecycle.shadowEditMetadata);
    } else {
        if (core.api.hasFocus(core)) {
            if (core.domEvent.tableSelectionRange) {
                return core.domEvent.tableSelectionRange;
            }

            if (core.domEvent.imageSelectionRange) {
                return core.domEvent.imageSelectionRange;
            }

            let selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
            if (!result && selection && selection.rangeCount > 0) {
                let range = selection.getRangeAt(0);
                if (contains(core.contentDiv, range)) {
                    return createNormalSelectionEx([range]);
                }
            }
        }

        return (
            core.domEvent.tableSelectionRange ??
            core.domEvent.imageSelectionRange ??
            createNormalSelectionEx(
                core.domEvent.selectionRange ? [core.domEvent.selectionRange] : []
            )
        );
    }
};

function createNormalSelectionEx(ranges: Range[]): SelectionRangeEx {
    return {
        type: SelectionRangeTypes.Normal,
        ranges: ranges,
        areAllCollapsed: checkAllCollapsed(ranges),
    };
}

function checkAllCollapsed(ranges: Range[]): boolean {
    return ranges.filter(range => range?.collapsed).length == ranges.length;
}
