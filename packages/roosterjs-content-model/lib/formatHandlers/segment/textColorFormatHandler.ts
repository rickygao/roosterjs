import { FormatHandler } from '../FormatHandler';
import { getColor, setColor } from '../utils/color';
import { TextColorFormat } from '../../publicTypes/format/formatParts/TextColorFormat';

/**
 * @internal
 */
export const textColorFormatHandler: FormatHandler<TextColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textColor =
            getColor(element, false /*isBackground*/, context.isDarkMode) || defaultStyle.color;

        if (textColor && textColor != 'inherit') {
            format.textColor = textColor;
        } else if (!textColor && element.tagName == 'A') {
            // Hyperlink won't inherit parent's color unless it has color explicitly specified
            format.textColor = undefined;
        }
    },
    apply: (format, element, context) => {
        const isLink = element.tagName == 'A';

        if (format.textColor && (!isLink || !!format.textColor)) {
            setColor(
                element,
                format.textColor,
                false /*isBackground*/,
                context.isDarkMode,
                context.getDarkColor
            );
        }
    },
};
