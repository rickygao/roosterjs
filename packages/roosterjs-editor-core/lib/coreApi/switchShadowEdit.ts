import { metadataToRangeEx, rangeExToMetadata, selectRangeEx } from './utils/contentMetadataUtils';
import {
    createEntityPlaceholder,
    getEntityFromElement,
    getEntitySelector,
    mergeFragmentWithEntity,
    moveChildNodes,
    queryElements,
} from 'roosterjs-editor-dom';
import {
    EditorCore,
    EntityPlaceholderPair,
    PluginEventType,
    SwitchShadowEdit,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export const switchShadowEdit: SwitchShadowEdit = (core: EditorCore, isOn: boolean): void => {
    const { lifecycle, contentDiv } = core;

    const wasInShadowEdit = !!lifecycle.shadowEditFragment;

    if (isOn) {
        if (!wasInShadowEdit) {
            const fragment = contentDiv.ownerDocument.createDocumentFragment();
            const selection =
                rangeExToMetadata(
                    contentDiv,
                    core.api.getSelectionRangeEx(core),
                    core.lifecycle.isDarkMode
                ) || null;

            moveChildNodes(fragment, contentDiv.cloneNode(true /*deep*/));
            fragment.normalize();

            const entityPairs = extractEntityPairs(fragment, contentDiv);

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: fragment,
                    selectionPath: null,
                    selectionMetadata: selection,
                },
                false /*broadcast*/
            );

            lifecycle.shadowEditFragment = fragment;
            lifecycle.shadowEditMetadata = selection;
            lifecycle.shadowEditEntityPairs = entityPairs;
        }

        if (lifecycle.shadowEditFragment) {
            mergeFragmentWithEntity(
                lifecycle.shadowEditFragment.cloneNode(true /*deep*/) as DocumentFragment, // Clone fragment to avoid nodes under fragment are moved to target so that it can be reused
                contentDiv,
                lifecycle.shadowEditEntityPairs
            );
        }
    } else {
        const {
            shadowEditFragment,
            shadowEditMetadata: shadowEditSelection,
            shadowEditEntityPairs,
        } = lifecycle;

        lifecycle.shadowEditFragment = null;
        lifecycle.shadowEditMetadata = null;
        lifecycle.shadowEditEntityPairs = null;
        lifecycle.shadowEditSelectionPath = null;

        if (wasInShadowEdit) {
            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false /*broadcast*/
            );

            if (shadowEditFragment) {
                mergeFragmentWithEntity(shadowEditFragment, contentDiv, shadowEditEntityPairs); // No need to clone here since we are leaving shadow edit and fragment will be cleared
            }

            core.api.focus(core);

            if (shadowEditSelection) {
                selectRangeEx(core, metadataToRangeEx(contentDiv, shadowEditSelection));
            }
        }
    }
};
function extractEntityPairs(
    fragment: DocumentFragment,
    contentDiv: HTMLDivElement
): EntityPlaceholderPair[] {
    const entityWrappers = queryElements(fragment, getEntitySelector());
    const entityPairs: EntityPlaceholderPair[] = [];

    entityWrappers.forEach(wrapper => {
        const entity = getEntityFromElement(wrapper);
        const originalWrapper =
            entity &&
            (contentDiv.querySelector(getEntitySelector(entity.type, entity.id)) as HTMLElement);

        if (entity && originalWrapper) {
            const placeholder = createEntityPlaceholder(entity);
            const skipRootCheck = wrapper.parentNode == fragment;

            entityPairs.push({
                entityWrapper: originalWrapper,
                placeholder: placeholder,
                skipRootCheck: skipRootCheck,
            });

            wrapper.parentNode?.replaceChild(placeholder, wrapper);
        }
    });
    return entityPairs;
}
