import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';

/**
 * @internal
 */
export function createDivider(
    tagName: 'HR' | 'DIV',
    format?: ContentModelBlockFormat
): ContentModelDivider {
    return {
        blockType: 'Divider',
        tagName,
        format: format ? { ...format } : {},
    };
}
