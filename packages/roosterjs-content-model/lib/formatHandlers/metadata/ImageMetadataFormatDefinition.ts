import { ImageMetadataFormat } from '../../publicTypes/format/formatParts/ImageMetadataFormat';
import {
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from 'roosterjs-editor-dom';

const NumberDefinition = createNumberDefinition();

/**
 * @internal
 */
export const ImageMetadataFormatDefinition = createObjectDefinition<ImageMetadataFormat>({
    widthPx: NumberDefinition,
    heightPx: NumberDefinition,
    leftPercent: NumberDefinition,
    rightPercent: NumberDefinition,
    topPercent: NumberDefinition,
    bottomPercent: NumberDefinition,
    angleRad: NumberDefinition,
    src: createStringDefinition(),
    naturalHeight: NumberDefinition,
    naturalWidth: NumberDefinition,
});
