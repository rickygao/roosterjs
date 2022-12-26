import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { getSelections } from './getSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function findFirstSelectedListItem(
    model: ContentModelDocument
): ContentModelListItem | undefined {
    let listItem: ContentModelListItem | undefined;

    getSelections(model).forEach(({ block }) => {
        if (!listItem && isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            listItem = block;
        }
    });

    return listItem;
}
