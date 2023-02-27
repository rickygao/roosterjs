import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBlock: ContentModelHandler<ContentModelBlock> = (
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
        case 'BlockGroup':
            context.modelHandlers.blockGroup(doc, parent, block, context, refNode);
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
    }
};
