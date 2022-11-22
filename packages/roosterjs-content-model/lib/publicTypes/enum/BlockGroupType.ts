/**
 * Type of Block Group in Content Model
 */
export type ContentModelBlockGroupType =
    /**
     * Represents the document entry of Content Model
     */
    | 'Document'

    /**
     * Represents group of blocks that has a bunch of format that need to be applied to a shared container.
     * e.g. margin, padding, border.
     */
    | 'FormatContainer'

    /**
     * Represents a list item (LI) element
     */
    | 'ListItem'

    /**
     * Represents a table cell (TD, TH) element
     */
    | 'TableCell'

    /**
     * Represents a general HTML element that doesn't have a special type
     */
    | 'General';
