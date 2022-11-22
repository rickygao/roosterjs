import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { createFormatContainer } from '../creators/createFormatContainer';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelections } from '../selection/getSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function indent(model: ContentModelDocument) {
    const paragraphs = getSelections(model);
    const paragraphOrListItem = getOperationalBlocks<ContentModelListItem>(paragraphs, [
        'ListItem',
    ]);

    let containerInfo: TempContainerInfo | undefined;

    paragraphOrListItem.forEach(item => {
        if (isBlockGroupOfType(item, 'ListItem')) {
            const newLevel: ContentModelListItemLevelFormat = {
                ...item.levels[item.levels.length - 1],
            };

            // New level is totally new, no need to have these attributes for now
            delete newLevel.startNumberOverride;
            delete newLevel.orderedStyleType;
            delete newLevel.unorderedStyleType;

            item.levels.push(newLevel);

            commitContainer(containerInfo);
            containerInfo = undefined;
        } else if (item.paragraph) {
            if (
                !containerInfo ||
                containerInfo.parentGroup != item.path[0] ||
                containerInfo.parentGroup.blocks[
                    containerInfo.deleteIndex + containerInfo.itemsToDelete
                ] != item.paragraph
            ) {
                commitContainer(containerInfo);

                containerInfo = {
                    parentGroup: item.path[0],
                    container: createFormatContainer(),
                    deleteIndex: item.path[0].blocks.indexOf(item.paragraph),
                    itemsToDelete: 0,
                };
            }

            containerInfo.container.blocks.push(item.paragraph);
            containerInfo.itemsToDelete++;
        }
    });

    commitContainer(containerInfo);

    return paragraphOrListItem.length > 0;
}

interface TempContainerInfo {
    parentGroup: ContentModelBlockGroup;
    container: ContentModelFormatContainer;
    itemsToDelete: number;
    deleteIndex: number;
}

function commitContainer(containerInfo?: TempContainerInfo) {
    if (containerInfo) {
        const { parentGroup, deleteIndex, itemsToDelete, container } = containerInfo;

        parentGroup.blocks.splice(deleteIndex, itemsToDelete, container);
    }
}
