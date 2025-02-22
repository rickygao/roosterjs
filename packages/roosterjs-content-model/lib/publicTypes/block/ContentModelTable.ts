import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockWithCache } from './ContentModelBlockWithCache';
import { ContentModelTableCell } from '../group/ContentModelTableCell';
import { ContentModelTableFormat } from '../format/ContentModelTableFormat';
import { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import { TableMetadataFormat } from '../format/formatParts/TableMetadataFormat';

/**
 * Content Model of Table
 */
export interface ContentModelTable
    extends ContentModelBlockBase<'Table', ContentModelTableFormat>,
        ContentModelWithDataset<TableMetadataFormat>,
        ContentModelBlockWithCache<HTMLTableElement> {
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
