import { ContentModelBr } from './ContentModelBr';
import { ContentModelEntitySegment } from './ContentModelEntitySegment';
import { ContentModelGeneralSegment } from './ContentModelGeneralSegment';
import { ContentModelImage } from './ContentModelImage';
import { ContentModelSelectionMarker } from './ContentModelSelectionMarker';
import { ContentModelText } from './ContentModelText';

/**
 * Union type of Content Model Segment
 */
export type ContentModelSegment =
    | ContentModelSelectionMarker
    | ContentModelText
    | ContentModelImage
    | ContentModelEntitySegment
    | ContentModelBr
    | ContentModelGeneralSegment;
