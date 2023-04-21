import { DirectionFormat } from './formatParts/DirectionFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';
import { WhiteSpaceFormat } from './formatParts/WhiteSpaceFormat';

/**
 * The format object for a paragraph in Content Model
 */
export type ContentModelBlockFormat = DirectionFormat & LineHeightFormat & WhiteSpaceFormat;
