import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockGroupFormat } from '../format/ContentModelBlockGroupFormat';

/**
 * Content Model of Format Container
 */
export interface ContentModelFormatContainer
    extends ContentModelBlockGroupBase<'FormatContainer'>,
        ContentModelBlockBase<'BlockGroup', ContentModelBlockGroupFormat> {}
