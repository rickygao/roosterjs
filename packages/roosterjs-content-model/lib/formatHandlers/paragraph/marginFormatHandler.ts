import { FormatHandler } from '../FormatHandler';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { parseValueWithUnit } from '../utils/parseValueWithUnit';

const MarginTopBottomKeys: (keyof MarginFormat & keyof CSSStyleDeclaration)[] = [
    'marginTop',
    'marginBottom',
];
const MarginLeftRightKeys: (keyof MarginFormat & keyof CSSStyleDeclaration)[] = [
    'marginLeft',
    'marginRight',
];

function createMarginFormatHandler(
    keys: (keyof MarginFormat & keyof CSSStyleDeclaration)[]
): FormatHandler<MarginFormat> {
    return {
        parse: (format, element, _, defaultStyle) => {
            keys.forEach(key => {
                const value = element.style[key] || defaultStyle[key];

                if (value) {
                    switch (key) {
                        case 'marginTop':
                        case 'marginBottom':
                            format[key] = value;
                            break;

                        case 'marginLeft':
                        case 'marginRight':
                            format[key] = format[key]
                                ? parseValueWithUnit(format[key] || '', element) +
                                  parseValueWithUnit(value, element) +
                                  'px'
                                : value;
                            break;
                    }
                }
            });
        },
        apply: (format, element, context) => {
            keys.forEach(key => {
                const value = format[key];
                if (value != context.implicitFormat[key]) {
                    element.style[key] = value || '0';
                }
            });
        },
    };
}

/**
 * @internal
 */
export const marginTopBottomFormatHandler: FormatHandler<MarginFormat> = createMarginFormatHandler(
    MarginTopBottomKeys
);

/**
 * @internal
 */
export const marginLeftRightFormatHandler: FormatHandler<MarginFormat> = createMarginFormatHandler(
    MarginLeftRightKeys
);
