import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBlockGroup: ContentModelHandler<ContentModelBlockGroup> = (
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    switch (group.blockGroupType) {
        case 'General':
            context.modelHandlers.general(doc, parent, group, context, refNode);
            break;

        case 'Quote':
            context.modelHandlers.quote(doc, parent, group, context, refNode);
            break;

        case 'ListItem':
            context.modelHandlers.listItem(doc, parent, group, context, refNode);
            break;

        default:
            context.modelHandlers.blockGroupChildren(doc, parent, group, context, refNode);
            break;
    }
};
