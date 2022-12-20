import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getClosestAncestorBlockGroup } from '../../modelApi/common/getOperationalBlocks';
import { getSelections } from '../../modelApi/selection/getSelections';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set start number of a list item
 * @param editor The editor to operate on
 * @param value The number to set to, must be equal or greater than 1
 */
export default function setListStartNumber(editor: IExperimentalContentModelEditor, value: number) {
    formatWithContentModel(editor, 'setListStartNumber', model => {
        const firstSelection = getSelections(model)[0];
        const listItem = firstSelection
            ? getClosestAncestorBlockGroup<ContentModelListItem>(firstSelection, ['ListItem'])
            : null;
        const level = listItem?.levels[listItem?.levels.length - 1];

        if (level) {
            level.startNumberOverride = value;

            return true;
        } else {
            return false;
        }
    });
}
