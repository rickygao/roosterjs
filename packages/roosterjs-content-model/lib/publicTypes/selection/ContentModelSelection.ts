import { ContentModelBlock } from '../block/ContentModelBlock';
import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../block/ContentModelParagraph';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ContentModelSelectionMarker } from '../segment/ContentModelSelectionMarker';
import { ContentModelSelectionType } from '../enum/SelectionType';
import { Selectable } from './Selectable';

/**
 * Base type of Content Model selection
 */
export interface ContentModelSelectionBase<T extends ContentModelSelectionType> {
    /**
     * Type of this selection
     */
    type: T;

    /**
     * A path that combines all parents of ContentModelBlockGroup of this paragraph. First element is the direct parent group, then next
     * one is first one's parent group, until last one, the root document group.
     * e.g. A table contains a list with a paragraph, like:
     * ContentModelDocument
     *   \ ContentModelTable
     *       \ ContentModelListItem
     *           \ ContentModelParagraph
     * Then the path will be:
     * [ContentModelListItem, ContentModelDocument]
     */
    path: ContentModelBlockGroup[];
}

/**
 * Content Model selection of segments within a paragraph
 */
export interface ContentModelSegmentsSelection extends ContentModelSelectionBase<'Segments'> {
    /**
     * Paragraph that contains selection.
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    paragraph: ContentModelParagraph;

    /**
     * Selected segments
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    segments: ContentModelSegment[];
}

/**
 * Content Model selection of collapsed insertion point (selection marker)
 */
export interface ContentModelMarkerSelection extends ContentModelSelectionBase<'Marker'> {
    /**
     * Paragraph that contains selection.
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    paragraph: ContentModelParagraph;

    /**
     * Selection marker the insertion point
     */
    marker: ContentModelSelectionMarker;
}

/**
 * Content Model selection of format holder (Used by list item)
 */
export interface ContentModelFormatHolderSelection
    extends ContentModelSelectionBase<'FormatHolder'> {
    /**
     * Selection marker the selected list item
     */
    formatHolder: ContentModelSelectionMarker;
}

/**
 * Content Model selection of single block
 */
export interface ContentModelBlockSelection extends ContentModelSelectionBase<'Block'> {
    /**
     * The selected block
     */
    block: ContentModelBlock & Selectable;
}

/**
 * Union type of Content Model selection
 */
export type ContentModelSelection =
    | ContentModelSegmentsSelection
    | ContentModelMarkerSelection
    | ContentModelFormatHolderSelection
    | ContentModelBlockSelection;
