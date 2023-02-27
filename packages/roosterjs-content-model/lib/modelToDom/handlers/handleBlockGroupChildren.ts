import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBlockGroupChildren: ContentModelHandler<ContentModelBlockGroup> = (
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const { listFormat } = context;
    const nodeStack = listFormat.nodeStack;

    try {
        group.blocks.forEach((childBlock, index) => {
            // When process list, we need a node stack.
            // When there are two continuous lists, they should share the same stack
            // so that list items with same type/threadId can be merged into the same list element
            // In other cases, clear the stack so that two separate lists won't share the same list element
            if (
                index == 0 ||
                childBlock.blockType != 'BlockGroup' ||
                childBlock.blockGroupType != 'ListItem'
            ) {
                listFormat.nodeStack = [];
            }

            const element = childBlock.element;

            // Check if there is cached element and if we can reuse it
            if (element?.parentNode == parent) {
                refNode = removeUntil(refNode, element);

                if (refNode) {
                    refNode = refNode.nextSibling;
                } else {
                    parent.appendChild(element);
                }

                if (childBlock.blockType == 'BlockGroup') {
                    context.modelHandlers.blockGroupChildren(
                        doc,
                        element,
                        childBlock,
                        context,
                        element.firstChild
                    );
                }
            } else {
                context.modelHandlers.block(doc, parent, childBlock, context, refNode);
            }
        });

        removeUntil(refNode);
    } finally {
        listFormat.nodeStack = nodeStack;
    }
};

function removeUntil(removeFrom: Node | null, nodeToStop?: Node) {
    while (removeFrom && (!nodeToStop || removeFrom != nodeToStop)) {
        const nodeToRemove = removeFrom;
        removeFrom = removeFrom.nextSibling;
        nodeToRemove.parentNode?.removeChild(nodeToRemove);
    }
    return removeFrom;
}
