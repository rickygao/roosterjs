import getTagOfNode from '../utils/getTagOfNode';
import safeInstanceOf from '../utils/safeInstanceOf';
import { Entity } from 'roosterjs-editor-types';

const EntityPlaceHolderTagName = 'ENTITY-PLACEHOLDER';

/**
 * Default implementation of merging DOM tree generated from Content Model in to existing container
 * @param source Source document fragment that is generated from Content Model
 * @param target Target container, usually to be editor root container
 * @param entities A map from entity id to entity wrapper, used for reusing existing DOM structure for entity
 * @param insertClonedNode When pass true, merge with a cloned copy of the nodes from source fragment rather than the nodes themselves @default false
 */
export default function mergeFragmentWithEntity(
    source: DocumentFragment,
    target: HTMLElement,
    entities: Record<string, HTMLElement> | null,
    insertClonedNode?: boolean
) {
    let anchor = target.firstChild;
    entities = entities || {};

    for (let current = source.firstChild; current; ) {
        let wrapper: HTMLElement | null = null;
        const next = current.nextSibling;

        if (
            getTagOfNode(current) == EntityPlaceHolderTagName &&
            (wrapper = entities[(<HTMLElement>current).id])
        ) {
            anchor = removeUntil(anchor, wrapper);

            if (anchor) {
                anchor = anchor.nextSibling;
            } else {
                target.appendChild(wrapper);
            }
        } else {
            const nodeToInsert = insertClonedNode ? current.cloneNode(true /*deep*/) : current;
            target.insertBefore(nodeToInsert, anchor);

            if (safeInstanceOf(nodeToInsert, 'HTMLElement')) {
                nodeToInsert.querySelectorAll(EntityPlaceHolderTagName).forEach(placeholder => {
                    wrapper = entities![placeholder.id];

                    if (wrapper) {
                        placeholder.parentNode?.replaceChild(wrapper, placeholder);
                    }
                });
            }
        }

        current = next;
    }

    removeUntil(anchor);
}

function removeUntil(anchor: ChildNode | null, nodeToStop?: HTMLElement) {
    while (anchor && (!nodeToStop || anchor != nodeToStop)) {
        const nodeToRemove = anchor;
        anchor = anchor.nextSibling;
        nodeToRemove.parentNode?.removeChild(nodeToRemove);
    }
    return anchor;
}

/**
 * Create a placeholder comment node for entity
 * @param entity The entity to create placeholder from
 * @returns A placeholder comment node as
 */
export function createEntityPlaceholder(entity: Entity): HTMLElement {
    const placeholder = entity.wrapper.ownerDocument.createElement(EntityPlaceHolderTagName);
    placeholder.id = entity.id;

    return placeholder;
}
