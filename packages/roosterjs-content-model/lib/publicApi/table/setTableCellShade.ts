import { findFirstSelectedTable } from '../../modelApi/selection/findFirstSelectedTable';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getSelections } from '../../modelApi/selection/getSelections';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { setTableCellBackgroundColor } from '../../modelApi/table/setTableCellBackgroundColor';

/**
 * Set table cell shade color
 * @param editor The editor instance
 * @param color The color to set
 */
export default function setTableCellShade(editor: IExperimentalContentModelEditor, color: string) {
    formatWithContentModel(editor, 'setTableCellShade', model => {
        const tableModel = findFirstSelectedTable(getSelections(model));

        if (tableModel) {
            normalizeTable(tableModel);
            setTableCellBackgroundColor(tableModel, color);

            return true;
        } else {
            return false;
        }
    });
}
