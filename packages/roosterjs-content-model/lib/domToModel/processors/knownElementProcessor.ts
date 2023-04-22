import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import { ContentModelDividerFormat } from '../../publicTypes/format/ContentModelDividerFormat';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelFormatContainerFormat } from '../../publicTypes/format/ContentModelFormatContainerFormat';
import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';
import { ContentModelParagraphFormat } from '../../publicTypes/format/ContentModelParagraphFormat';
import { createDivider } from '../../modelApi/creators/createDivider';
import { createFormatContainer } from '../../modelApi/creators/createFormatContainer';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from '../utils/isBlockElement';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
// import { extractBorderValues } from '../../domUtils/borderValues';

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const isBlock = isBlockElement(element, context);
    const isLink = element.tagName == 'A' && element.hasAttribute('href');
    const isCode = element.tagName == 'CODE';

    stackFormat(
        context,
        {
            segment: isBlock ? 'shallowCloneForBlock' : 'shallowClone',
            paragraph: 'shallowClone',
        },
        () => {
            let topDivider: ContentModelDivider | undefined;
            let bottomDivider: ContentModelDivider | undefined;
            let formatContainer: ContentModelFormatContainer | undefined;
            let decorator: ContentModelParagraphDecorator | undefined;

            if (isBlock) {
                parseFormat(element, context.formatParsers.block, context.blockFormat, context);
                parseFormat(
                    element,
                    context.formatParsers.segmentOnBlock,
                    context.segmentFormat,
                    context
                );

                switch (element.tagName) {
                    case 'P':
                    case 'H1':
                    case 'H2':
                    case 'H3':
                    case 'H4':
                    case 'H5':
                    case 'H6':
                        decorator = createParagraphDecorator(
                            element.tagName,
                            context.segmentFormat
                        );
                        break;
                    default:
                        const divider: ContentModelDividerFormat = {};
                        const container: ContentModelFormatContainerFormat = {};

                        parseFormat(element, context.formatParsers.divider, divider, context);
                        parseFormat(element, context.formatParsers.container, container, context);

                        topDivider = tryCreateDivider(divider, true /*isTop*/);
                        bottomDivider = tryCreateDivider(divider, false /*isBottom*/);

                        if (Object.keys(container).length > 0) {
                            formatContainer = createFormatContainer(element.tagName, container);
                        }

                        break;
                }

                if (topDivider) {
                    if (context.isInSelection) {
                        topDivider.isSelected = true;
                    }

                    addBlock(group, topDivider);
                }
            } else {
                parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);
            }

            if (isCode) {
                stackFormat(context, { code: 'codeDefault' }, () => {
                    parseFormat(element, context.formatParsers.code, context.code.format, context);

                    context.elementProcessors.child(group, element, context);
                });
            } else if (isLink) {
                stackFormat(context, { link: 'linkDefault' }, () => {
                    parseFormat(element, context.formatParsers.link, context.link.format, context);
                    parseFormat(
                        element,
                        context.formatParsers.dataset,
                        context.link.dataset,
                        context
                    );

                    context.elementProcessors.child(group, element, context);
                });
            } else if (formatContainer) {
                addBlock(group, formatContainer);

                context.elementProcessors.child(formatContainer, element, context);
            } else {
                const paragraphFormat: ContentModelParagraphFormat = {
                    ...context.blockFormat,
                };

                parseFormat(element, context.formatParsers.paragraph, paragraphFormat, context);

                const paragraph = createParagraph(false /*isImplicit*/, paragraphFormat, decorator);

                addBlock(group, paragraph);

                context.elementProcessors.child(group, element, context);
            }

            if (bottomDivider) {
                if (context.isInSelection) {
                    bottomDivider.isSelected = true;
                }

                addBlock(group, bottomDivider);
            }
        }
    );

    if (isBlock) {
        addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
    }
};

function tryCreateDivider(
    format: ContentModelDividerFormat,
    isTop: boolean
): ContentModelDivider | undefined {
    const marginName: keyof ContentModelDividerFormat = isTop ? 'marginTop' : 'marginBottom';
    const paddingName: keyof ContentModelDividerFormat = isTop ? 'paddingTop' : 'paddingBottom';
    // const borderName: keyof ContentModelDividerFormat = isTop ? 'borderTop' : 'borderBottom';

    const marginNumber = parseInt(format[marginName] || '');
    const paddingNumber = parseInt(format[paddingName] || '');
    // const borderString = format[borderName];

    let result: ContentModelDivider | undefined;

    if (marginNumber > 0 || paddingNumber > 0 /* || borderString*/) {
        result = createDivider('div');

        if (marginNumber > 0) {
            result.format[marginName] = format[marginName];
        }

        if (paddingNumber > 0) {
            result.format[paddingName] = format[paddingName];
        }

        // if (borderString) {
        //     const border = extractBorderValues(borderString);

        //     if (border.style && border.style != 'none') {
        //         result.format[borderName] = borderString;
        //     }
        // }
    }

    delete format[marginName];
    delete format[paddingName];
    // delete format[borderName];

    return result;
}
