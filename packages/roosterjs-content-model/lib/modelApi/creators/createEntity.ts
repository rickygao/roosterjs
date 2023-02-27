import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createEntity(
    element: HTMLElement,
    isReadonly: boolean,
    segmentFormat?: ContentModelSegmentFormat,
    id?: string,
    type?: string
): ContentModelEntity {
    return {
        segmentType: 'Entity',
        blockType: 'Entity',
        format: {
            ...(segmentFormat || {}),
        },
        id,
        type,
        isReadonly,
        element,
    };
}
