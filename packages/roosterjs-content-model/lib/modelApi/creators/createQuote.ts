import { ContentModelBlockFormat } from 'roosterjs-content-model/lib/publicTypes/format/ContentModelBlockFormat';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';

/**
 * @internal
 */
export function createQuote(format?: ContentModelBlockFormat): ContentModelQuote {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'Quote',
        blocks: [],
        format: { ...(format || {}) },
    };
}
