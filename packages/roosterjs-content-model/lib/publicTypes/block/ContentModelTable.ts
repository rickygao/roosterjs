import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelDatasetBase } from '../format/ContentModelDatasetBase';
import { ContentModelTableCell } from './group/ContentModelTableCell';
import { ContentModelTableFormat } from '../format/ContentModelTableFormat';
import { TableMetadataFormat } from '../format/formatParts/TableMetadataFormat';

/**
 * Content Model of Table
 */
export interface ContentModelTable
    extends ContentModelBlockBase<'Table', ContentModelTableFormat>,
        ContentModelDatasetBase<TableMetadataFormat> {
    /**
     * Widths of each column
     */
    widths: number[];

    /**
     * Heights of each row
     */
    heights: number[];

    /**
     * Cells of this table
     */
    cells: ContentModelTableCell[][];
}
