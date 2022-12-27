import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelections } from './getSelections';

/**
 * @internal
 */
export function findFirstSelectedTable(model: ContentModelDocument): ContentModelTable | undefined {
    let table: ContentModelTable | undefined;

    getSelections(model).forEach(({ block, tableContext }) => {
        if (!table) {
            if (block?.blockType == 'Table') {
                table = block;
            } else if (tableContext) {
                table = tableContext.table;
            }
        }
    });

    return table;
}
