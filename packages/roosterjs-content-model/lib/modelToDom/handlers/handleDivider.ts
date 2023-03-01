import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleDivider: ContentModelBlockHandler<ContentModelDivider> = (
    doc: Document,
    parent: Node,
    divider: ContentModelDivider,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const element = doc.createElement(divider.tagName);

    divider.cachedElement = element;
    applyFormat(element, context.formatAppliers.divider, divider.format, context);

    parent.insertBefore(element, refNode);
};
