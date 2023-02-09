import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DefaultStyleMap, FormatParser } from '../../publicTypes/context/DomToModelSettings';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { getDefaultStyle } from './getDefaultStyle';

/**
 * @internal
 */
export function parseFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    parsers: (FormatParser<T> | null)[],
    format: T,
    context: DomToModelContext,
    tagNameOverride?: keyof DefaultStyleMap
) {
    const defaultStyle = getDefaultStyle(element, context, tagNameOverride);

    parsers.forEach(parser => {
        parser?.(format, element, context, defaultStyle);
    });
}
