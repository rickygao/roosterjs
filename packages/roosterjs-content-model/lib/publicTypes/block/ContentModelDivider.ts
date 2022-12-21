import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelSelectionMarker } from '../segment/ContentModelSelectionMarker';

/**
 * Content Model of horizontal divider
 */
export interface ContentModelDivider extends ContentModelBlockBase<'Divider'> {
    /**
     * Tag name of this element, either HR or DIV
     */
    tagName: 'hr' | 'div';

    /**
     * Set this marker when this divider is in selection
     */
    selectionMarker?: ContentModelSelectionMarker;
}
