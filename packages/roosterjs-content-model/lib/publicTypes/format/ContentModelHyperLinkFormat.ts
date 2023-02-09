import { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import { LinkFormat } from './formatParts/LinkFormat';

/**
 * The format object for a hyperlink in Content Model
 */
export type ContentModelHyperLinkFormat = ContentModelSegmentFormat & LinkFormat;
