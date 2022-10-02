import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of Image
 */
export interface ContentModelImage extends ContentModelSegmentBase<'Image'> {
    /**
     * src of this image
     */
    src: string;

    /**
     * Alternate text of this image
     */
    alterText?: string;
}
