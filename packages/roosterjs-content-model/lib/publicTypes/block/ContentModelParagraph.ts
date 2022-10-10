import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Content Model of Paragraph
 */
export interface ContentModelParagraph
    extends ContentModelBlockBase<'Paragraph'>,
        ContentModelWithFormat<ContentModelBlockFormat> {
    /**
     * Segments within this paragraph
     */
    segments: ContentModelSegment[];

    /**
     * Whether this block was created from a block HTML element or just some simple segment between other block elements.
     * True means it doesn't have a related block element, false means it was from a block element
     */
    isImplicit?: boolean;
}
