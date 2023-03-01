import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBlock: ContentModelBlockHandler<ContentModelBlock> = (
    doc: Document,
    parent: Node,
    block: ContentModelBlock,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    switch (block.blockType) {
        case 'Table':
            context.modelHandlers.table(doc, parent, block, context, refNode);
            break;
        case 'Paragraph':
            context.modelHandlers.paragraph(doc, parent, block, context, refNode);
            break;
        case 'Entity':
            context.modelHandlers.entity(doc, parent, block, context, refNode);
            break;
        case 'Divider':
            context.modelHandlers.divider(doc, parent, block, context, refNode);
            break;
        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'General':
                    context.modelHandlers.general(doc, parent, block, context, refNode);
                    break;

                case 'Quote':
                    context.modelHandlers.quote(doc, parent, block, context, refNode);
                    break;

                case 'ListItem':
                    context.modelHandlers.listItem(doc, parent, block, context, refNode);
                    break;
            }

            break;
    }
};
