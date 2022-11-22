import { BorderFormat } from './formatParts/BorderFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { SizeFormat } from './formatParts/SizeFormat';

/**
 * Format for Content Model Format Container
 */
export type ContentModelBlockGroupFormat = MarginFormat & PaddingFormat & BorderFormat & SizeFormat;
