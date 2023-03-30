import { ContentModelEditorCore } from '../../publicTypes/ContentModelEditorCore';
import { getSelectionPath, moveContentWithEntityPlaceholders } from 'roosterjs-editor-dom';
import {
    PluginEventType,
    SelectionRangeEx,
    SelectionRangeTypes,
    SwitchShadowEdit,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export const switchShadowEdit: SwitchShadowEdit = (
    core: ContentModelEditorCore,
    isOn: boolean
): void => {
    const { lifecycle, contentDiv, originalContentModel } = core;
    let {
        shadowEditEntities,
        shadowEditFragment,
        shadowEditSelectionPath,
        shadowEditTableSelectionPath,
        shadowEditImageSelectionPath,
    } = lifecycle;
    const wasInShadowEdit = !!shadowEditFragment;

    const getShadowEditSelectionPath = (
        selectionType: SelectionRangeTypes,
        shadowEditSelection?: SelectionRangeEx
    ) => {
        return (
            (shadowEditSelection?.type == selectionType &&
                shadowEditSelection.ranges
                    .map(range => getSelectionPath(contentDiv, range))
                    .map(w => w!!)) ||
            null
        );
    };

    if (isOn) {
        if (!wasInShadowEdit) {
            core.originalContentModel = core.api.createContentModel(core);
            core.shadowEditContentModel = core.api.createContentModel(core, {
                ignoreCache: true,
            });

            //#region To be compatible with old API only
            const selection = core.api.getSelectionRangeEx(core);
            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

            shadowEditSelectionPath = range && getSelectionPath(contentDiv, range);
            shadowEditTableSelectionPath = getShadowEditSelectionPath(
                SelectionRangeTypes.TableSelection,
                selection
            );
            shadowEditImageSelectionPath = getShadowEditSelectionPath(
                SelectionRangeTypes.ImageSelection,
                selection
            );

            shadowEditEntities = {};
            shadowEditFragment = moveContentWithEntityPlaceholders(contentDiv, shadowEditEntities);

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: shadowEditFragment,
                    selectionPath: shadowEditSelectionPath,
                },
                false /*broadcast*/
            );

            lifecycle.shadowEditFragment = shadowEditFragment;
            lifecycle.shadowEditSelectionPath = shadowEditSelectionPath;
            lifecycle.shadowEditTableSelectionPath = shadowEditTableSelectionPath;
            lifecycle.shadowEditImageSelectionPath = shadowEditImageSelectionPath;
            lifecycle.shadowEditEntities = shadowEditEntities;

            //#endregion
        }

        if (core.shadowEditContentModel) {
            core.api.setContentModel(core, core.shadowEditContentModel);
        }
    } else {
        lifecycle.shadowEditFragment = null;
        lifecycle.shadowEditSelectionPath = null;
        lifecycle.shadowEditEntities = null;
        core.shadowEditContentModel = undefined;
        core.originalContentModel = undefined;

        if (wasInShadowEdit) {
            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false /*broadcast*/
            );

            if (originalContentModel) {
                core.api.setContentModel(core, originalContentModel);
            }
            core.api.focus(core);
        }
    }
};
