import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelParagraphFormat } from '../format/ContentModelParagraphFormat';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Content Model of Paragraph
 */
export interface ContentModelParagraph
    extends ContentModelBlockBase<'Paragraph'>,
        ContentModelWithFormat<ContentModelParagraphFormat> {
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
