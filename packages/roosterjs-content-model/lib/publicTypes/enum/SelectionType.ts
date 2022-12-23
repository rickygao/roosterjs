/**
 * Type of selections of Content Model
 */
export type ContentModelSelectionType =
    /**
     * A bunch of segments under a given paragraph
     */
    | 'Segments'

    /**
     * Single selection marker under a paragraph, mostly used for insert new content
     */
    | 'Marker'

    /**
     * The list selection marker for a list item, used for change format of list number
     */
    | 'FormatHolder'

    /**
     * Whole block selection (divider, entity, ...), used for delete selected content
     */
    | 'Block';
