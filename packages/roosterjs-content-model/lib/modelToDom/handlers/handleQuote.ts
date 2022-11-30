import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const handleQuote: ContentModelHandler<ContentModelQuote> = (
    doc: Document,
    parent: Node,
    quote: ContentModelQuote,
    context: ModelToDomContext
) => {
    if (!isBlockGroupEmpty(quote)) {
        const blockQuote = doc.createElement('blockquote');
        parent.appendChild(blockQuote);

        stackFormat(context, 'blockquote', () => {
            applyFormat(blockQuote, context.formatAppliers.block, quote.format, context);
            context.modelHandlers.blockGroupChildren(doc, blockQuote, quote, context);
        });
    }
};
