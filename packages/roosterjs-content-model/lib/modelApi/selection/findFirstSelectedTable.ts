import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSelection } from '../selection/getSelections';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';

/**
 * @internal
 */
export function findFirstSelectedTable(
    selections: ContentModelSelection[]
): ContentModelTable | undefined {
    let table: ContentModelTable | undefined;

    for (let i = 0; i < selections.length; i++) {
        const selection = selections[i];

        for (let j = 0; j < selection.path.length; j++) {
            const group = selection.path[j];

            if (isTableCell(group)) {
                const tableParent = selection.path[j + 1];

                table = tableParent?.blocks.filter(
                    x => x.blockType == 'Table' && x.cells.some(row => row.indexOf(group) >= 0)
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

function isTableCell(group: ContentModelBlockGroup): group is ContentModelTableCell {
    return group.blockGroupType == 'TableCell';
}
