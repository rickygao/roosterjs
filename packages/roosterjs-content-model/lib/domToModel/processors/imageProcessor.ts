import { addSegment } from '../../modelApi/common/addSegment';
import { createImage } from '../../modelApi/creators/createImage';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';

/**
 * @internal
 */
export const imageProcessor: ElementProcessor = (group, element, context) => {
    const imageElement = element as HTMLImageElement;
    const originalSegmentFormat = context.segmentFormat;

    context.segmentFormat = { ...originalSegmentFormat };

    parseFormat(imageElement, SegmentFormatHandlers, context.segmentFormat, context);

    const image = createImage(imageElement, context.segmentFormat);

    if (context.isInSelection) {
        image.isSelected = true;
    }

    addSegment(group, image, context.blockFormat);

    context.segmentFormat = originalSegmentFormat;
};
