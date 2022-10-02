import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createImage(
    img: HTMLImageElement,
    format?: ContentModelSegmentFormat
): ContentModelImage {
    return {
        segmentType: 'Image',
        format: format ? { ...format } : {},
        src: img.src,
    };
}
