import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import { createDivider } from '../../modelApi/creators/createDivider';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { MarginFormat } from 'roosterjs-content-model/lib/publicTypes/format/formatParts/MarginFormat';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const preProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    stackFormat(
        context,
        {
            paragraph: 'empty',
            segment: 'shallowClone',
        },
        () => {
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);
            parseFormat(element, context.formatParsers.block, context.blockFormat, context);

            const topDivider = tryCreateDivider(context.blockFormat, 'marginTop');
            const bottomDivider = tryCreateDivider(context.blockFormat, 'marginBottom');

            if (topDivider) {
                addBlock(group, topDivider);
            }

            context.elementProcessors.child(group, element, context);

            if (bottomDivider) {
                addBlock(group, bottomDivider);
            }
        }
    );
};

function tryCreateDivider(
    format: MarginFormat,
    propName: keyof MarginFormat
): ContentModelDivider | null {
    const marginTop = parseInt(format[propName] || '');
    let result: ContentModelDivider | null = null;

    if (marginTop > 0) {
        result = createDivider('DIV', { marginTop: format[propName] });
        delete format[propName];
    }

    return result;
}
