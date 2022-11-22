import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleFormatContainer: ContentModelHandler<ContentModelFormatContainer> = (
    doc: Document,
    parent: Node,
    quote: ContentModelFormatContainer,
    context: ModelToDomContext
) => {
    if (!isBlockGroupEmpty(quote)) {
        const blockQuote = doc.createElement('blockquote');
        blockQuote.style.marginTop = '0';
        blockQuote.style.marginBottom = '0';
        parent.appendChild(blockQuote);

        context.modelHandlers.blockGroupChildren(doc, blockQuote, quote, context);
    }
};
