import isNodeAfter from '../utils/isNodeAfter';
import moveChildNodes from '../utils/moveChildNodes';
import { Entity, EntityPlaceholderPair, NodeType } from 'roosterjs-editor-types';

const EntityPlaceHolderCommentPrefix = 'Entity:';

/**
 * Default implementation of merging DOM tree generated from Content Model in to existing container
 * @param source Source document fragment that is generated from Content Model
 * @param target Target container, usually to be editor root container
 * @param entityPairs An array of entity wrapper - placeholder pairs, used for reuse existing DOM structure for entity
 */
export default function mergeFragmentWithEntity(
    source: DocumentFragment,
    target: HTMLElement,
    entityPairs: EntityPlaceholderPair[] | null
) {
    const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel(
        entityPairs,
        source,
        target
    );

    if (reusableWrappers.length == 0) {
        moveChildNodes(target);
        target.appendChild(source);
    } else {
        const nodesToRemove: Node[] = [];

        for (let child = target.firstChild; child; child = child.nextSibling) {
            if (reusableWrappers.indexOf(child) < 0) {
                nodesToRemove.push(child);
            }
        }

        nodesToRemove.forEach(node => target.removeChild(node));

        for (let i = 0; i <= reusableWrappers.length; i++) {
            while (source.firstChild && !isSamePlaceholder(source.firstChild, placeholders[i])) {
                target.insertBefore(source.firstChild, reusableWrappers[i] || null);
            }

            if (source.firstChild && isSamePlaceholder(source.firstChild, placeholders[i])) {
                source.removeChild(source.firstChild);
            }
        }
    }
}

function isSamePlaceholder(nodeToCheck: Node, placeholder: Node): boolean {
    return (
        nodeToCheck.nodeType == NodeType.Comment && nodeToCheck.nodeValue == placeholder.nodeValue
    );
}

/**
 * Create a placeholder comment node for entity
 * @param entity The entity to create placeholder from
 * @returns A placeholder comment node as
 */
export function createEntityPlaceholder(entity: Entity): Comment {
    return entity.wrapper.ownerDocument.createComment(EntityPlaceHolderCommentPrefix + entity.id);
}

/**
 * @internal
 */
export function preprocessEntitiesFromContentModel(
    entityPairs: EntityPlaceholderPair[] | null,
    source?: DocumentFragment,
    target?: HTMLElement
): { reusableWrappers: Node[]; placeholders: Node[] } {
    const reusableWrappers: Node[] = [];
    const placeholders: Node[] = [];

    entityPairs?.forEach(pair => {
        const { entityWrapper, placeholder, skipRootCheck } = pair;
        const parent = placeholder.parentNode;
        const lastWrapper = reusableWrappers[reusableWrappers.length - 1];
        const lastPlaceholder = placeholders[placeholders.length - 1];

        if (
            source &&
            target &&
            (skipRootCheck || parent == source) &&
            entityWrapper.parentNode == target &&
            (!lastWrapper || isNodeAfter(entityWrapper, lastWrapper)) &&
            (!lastPlaceholder || isNodeAfter(placeholder, lastPlaceholder))
        ) {
            reusableWrappers.push(entityWrapper);
            placeholders.push(placeholder);
        } else if (parent) {
            parent.replaceChild(pair.entityWrapper, pair.placeholder);
        }
    });
    return { reusableWrappers, placeholders };
}
