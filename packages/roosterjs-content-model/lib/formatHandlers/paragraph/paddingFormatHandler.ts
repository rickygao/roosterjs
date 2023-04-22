import { FormatHandler } from '../FormatHandler';
import { PaddingFormat } from '../../publicTypes/format/formatParts/PaddingFormat';

const PaddingTopBottomKeys: (keyof PaddingFormat & keyof CSSStyleDeclaration)[] = [
    'paddingTop',
    'paddingBottom',
];
const PaddingLeftRightKeys: (keyof PaddingFormat & keyof CSSStyleDeclaration)[] = [
    'paddingLeft',
    'paddingRight',
];

function createPaddingFormatHandler(
    keys: (keyof PaddingFormat & keyof CSSStyleDeclaration)[]
): FormatHandler<PaddingFormat> {
    return {
        parse: (format, element) => {
            keys.forEach(key => {
                const value = element.style[key];

                if (value) {
                    format[key] = value;
                }
            });
        },
        apply: (format, element) => {
            keys.forEach(key => {
                const value = format[key];
                if (value) {
                    element.style[key] = value;
                }
            });
        },
    };
}

/**
 * @internal
 */
export const paddingTopBottomFormatHandler: FormatHandler<PaddingFormat> = createPaddingFormatHandler(
    PaddingTopBottomKeys
);

/**
 * @internal
 */
export const paddingLeftRightFormatHandler: FormatHandler<PaddingFormat> = createPaddingFormatHandler(
    PaddingLeftRightKeys
);
