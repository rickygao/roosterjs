import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { findSelectedTable } from '../../modelApi/table/findSelectedTable';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { TableMetadataFormat } from '../../publicTypes/format/formatParts/TableMetadataFormat';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param format The table format to apply
 * @param keepCellShade Whether keep existing shade color when apply format if there is a manually set shade color
 */
export default function formatTable(
    editor: IExperimentalContentModelEditor,
    format: TableMetadataFormat,
    keepCellShade?: boolean
) {
    formatWithContentModel(editor, 'formatTable', model => {
        const tableModel = findSelectedTable(model);

        if (tableModel) {
            applyTableFormat(tableModel, format, keepCellShade);

            return true;
        } else {
            return false;
        }
    });
}
