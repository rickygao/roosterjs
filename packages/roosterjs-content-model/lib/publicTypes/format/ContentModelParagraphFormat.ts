import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';

/**
 * The format object for a paragraph in Content Model
 */
export type ContentModelParagraphFormat = ContentModelBlockFormat & MarginFormat & PaddingFormat;
