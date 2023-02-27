import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleListItem: ContentModelHandler<ContentModelListItem> = (
    doc: Document,
    parent: Node,
    listItem: ContentModelListItem,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    context.modelHandlers.list(doc, parent, listItem, context, refNode);

    const { nodeStack } = context.listFormat;

    let listParent = nodeStack?.[nodeStack?.length - 1]?.node || parent;
    let tag = getTagOfNode(listParent);

    if (tag == 'OL' || tag == 'UL') {
        const li = doc.createElement('li');
        const level = listItem.levels[listItem.levels.length - 1];

        listParent.appendChild(li);
        listParent = li;

        applyFormat(li, context.formatAppliers.segment, listItem.formatHolder.format, context);

        if (level) {
            applyFormat(li, context.formatAppliers.listItem, level, context);
        }

        context.modelHandlers.blockGroupChildren(doc, listParent, listItem, context, null);
    }

    // Here we only handle the case when parent node is OL/UL.
    // For the case that list level is empty and parent node is not OL/UL, it should already be handled
    // when normalize the Content Model so that case should never happen here.
};
