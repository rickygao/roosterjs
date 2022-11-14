import { EditorCore, Entity, PluginEventType, SwitchShadowEdit } from 'roosterjs-editor-types';
import { metadataToRangeEx, rangeExToMetadata, selectRangeEx } from './utils/contentMetadataUtils';
import {
    createEntityPlaceholder,
    getEntityFromElement,
    getEntitySelector,
    mergeFragmentWithEntity,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const switchShadowEdit: SwitchShadowEdit = (core: EditorCore, isOn: boolean): void => {
    const { lifecycle, contentDiv } = core;

    const wasInShadowEdit = !!lifecycle.shadowEditFragment;

    if (isOn) {
        if (!wasInShadowEdit) {
            const rangeEx = core.api.getSelectionRangeEx(core);
            const selection = rangeExToMetadata(contentDiv, rangeEx, lifecycle.isDarkMode) || null;
            const entities: Record<string, HTMLElement> = {};
            const fragment = moveContentToFragmentWithEntities(contentDiv, entities);

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
            lifecycle.shadowEditEntities = entities;
        }

        if (lifecycle.shadowEditFragment) {
            mergeFragmentWithEntity(
                lifecycle.shadowEditFragment,
                contentDiv,
                lifecycle.shadowEditEntities,
                true /*insertClonedNode*/
            );
        }
    } else {
        const {
            shadowEditFragment,
            shadowEditMetadata: shadowEditSelection,
            shadowEditEntities,
        } = lifecycle;

        lifecycle.shadowEditFragment = null;
        lifecycle.shadowEditMetadata = null;
        lifecycle.shadowEditEntities = null;
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
                mergeFragmentWithEntity(shadowEditFragment, contentDiv, shadowEditEntities);
            }

            core.api.focus(core);

            if (shadowEditSelection) {
                selectRangeEx(core, metadataToRangeEx(contentDiv, shadowEditSelection));
            }
        }
    }
};

function moveContentToFragmentWithEntities(
    contentDiv: HTMLDivElement,
    entities: Record<string, HTMLElement>
) {
    const entitySelector = getEntitySelector();
    const fragment = contentDiv.ownerDocument.createDocumentFragment();
    let next: Node | null = null;

    for (let child: Node | null = contentDiv.firstChild; child; child = next) {
        let entity: Entity | null;
        let nodeToAppend = child;

        next = child.nextSibling;

        if (safeInstanceOf(child, 'HTMLElement')) {
            if ((entity = getEntityFromElement(child))) {
                nodeToAppend = handleEntity(entity, entities);
            } else {
                child.querySelectorAll<HTMLElement>(entitySelector).forEach(wrapper => {
                    if ((entity = getEntityFromElement(wrapper))) {
                        const placeholder = handleEntity(entity, entities);

                        wrapper.parentNode?.replaceChild(placeholder, wrapper);
                    }
                });
            }
        }

        fragment.appendChild(nodeToAppend);
    }

    fragment.normalize();

    return fragment;
}

function handleEntity(entity: Entity, entities: Record<string, HTMLElement>) {
    const placeholder = createEntityPlaceholder(entity);

    entities[entity.id] = entity.wrapper;

    return placeholder;
}
