import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { getSelections } from '../selection/getSelections';

/**
 * @internal
 */
export function findSelectedTable(model: ContentModelBlockGroup): ContentModelTable | undefined {
    const selections = getSelections(model);
    let table: ContentModelTable | undefined;

    for (let i = 0; i < selections.length; i++) {
        const selection = selections[i];

        for (let j = 0; j < selection.path.length; j++) {
            const cell = selection.path[j];
            if ((<ContentModelTableCell>cell).blockGroupType == 'TableCell') {
                const tableParent = selection.path[j + 1];
                table = tableParent.blocks.filter(
                    x => x.blockType == 'Table' && x.cells.some(y => y.some(cell => cell == cell))
                )[0] as ContentModelTable;

                if (table) {
                    break;
                }
            }
        }

        if (table) {
            break;
        }
    }

    return table;
}
