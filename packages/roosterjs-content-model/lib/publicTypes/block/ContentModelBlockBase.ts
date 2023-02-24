import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelBlockType } from '../enum/BlockType';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Base type of a block
 */
export interface ContentModelBlockBase<
    T extends ContentModelBlockType,
    TFormat extends ContentModelBlockFormat = ContentModelBlockFormat
> extends ContentModelWithFormat<TFormat> {
    /**
     * Type of this block
     */
    blockType: T;

    /**
     * HTML DOM element that was created from this model.
     * If nothing has been changed in this model since this cached element was created,
     * it can be reused next time when create DOM
     */
    cachedElement?: HTMLElement;
}
