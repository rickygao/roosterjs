import { applyFormat } from '../utils/applyFormat';
import { ContentModelGeneralBlock } from '../../publicTypes/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const handleGeneralModel: ContentModelHandler<ContentModelGeneralBlock> = (
    doc: Document,
    parent: Node,
    group: ContentModelGeneralBlock,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const element = group.element.cloneNode();

    parent.insertBefore(element, refNode);

    if (isGeneralSegment(group) && isNodeOfType(element, NodeType.Element)) {
        if (!group.element.firstChild) {
            context.regularSelection.current.segment = element;
        }

        applyFormat(element, context.formatAppliers.segment, group.format, context);

        if (group.link) {
            context.modelHandlers.link(doc, element, group.link, context, null);
        }
    }

    context.modelHandlers.blockGroupChildren(doc, element, group, context, null);
};

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
