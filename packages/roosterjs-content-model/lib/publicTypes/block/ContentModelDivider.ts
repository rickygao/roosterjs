import { ContentModelBlockBase } from './ContentModelBlockBase';

/**
 * Content Model of horizontal divider
 */
export interface ContentModelDivider extends ContentModelBlockBase<'Divider'> {
    /**
     * Tag name of this element, either HR or DIV
     */
    tagName: 'HR' | 'DIV';

    /**
     * Whether this element is selected
     */
    isSelected?: boolean;
}
