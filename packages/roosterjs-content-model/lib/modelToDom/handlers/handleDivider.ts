import { applyFormat } from '../utils/applyFormat';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleDivider: ContentModelHandler<ContentModelDivider> = (
    doc: Document,
    parent: Node,
    divider: ContentModelDivider,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const element = doc.createElement(divider.tagName);

    divider.element = element;
    applyFormat(element, context.formatAppliers.divider, divider.format, context);

    parent.insertBefore(element, refNode);
};
