import { applyFormat } from '../utils/applyFormat';
import { commitEntity, getObjectKeys } from 'roosterjs-editor-dom';
import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { Entity } from 'roosterjs-editor-types';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleEntity: ContentModelHandler<ContentModelEntity> = (
    doc: Document,
    parent: Node,
    entityModel: ContentModelEntity,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const { element, id, type, isReadonly, format } = entityModel;
    const entity: Entity | null =
        id && type
            ? {
                  wrapper: element,
                  id,
                  type,
                  isReadonly: !!isReadonly,
              }
            : null;

    if (entity) {
        // Commit the entity attributes in case there is any change
        commitEntity(element, entity.type, entity.isReadonly, entity.id);
    }

    if (getObjectKeys(format).length > 0) {
        const span = doc.createElement('span');

        parent.insertBefore(span, refNode);
        refNode = null;

        applyFormat(span, context.formatAppliers.segment, format, context);
        parent = span;
    }

    parent.insertBefore(element, refNode);
};
