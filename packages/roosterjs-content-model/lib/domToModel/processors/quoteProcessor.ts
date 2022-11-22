import { addBlock } from '../../modelApi/common/addBlock';
import { createFormatContainer } from '../../modelApi/creators/createFormatContainer';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getObjectKeys, getStyles } from 'roosterjs-editor-dom';

const KnownQuoteStyleNames = ['margin-top', 'margin-bottom'];

/**
 * @internal
 */
export const quoteProcessor: ElementProcessor<HTMLQuoteElement> = (group, element, context) => {
    const styles = getStyles(element);

    if (
        parseInt(element.style.marginTop) === 0 &&
        parseInt(element.style.marginBottom) === 0 &&
        getObjectKeys(styles).every(key => KnownQuoteStyleNames.indexOf(key) >= 0)
    ) {
        const quote = createFormatContainer();

        addBlock(group, quote);
        context.elementProcessors.child(quote, element, context);
    } else {
        context.elementProcessors['*'](group, element, context);
    }
};
