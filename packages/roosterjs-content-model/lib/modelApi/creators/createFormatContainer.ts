import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';

/**
 * @internal
 */
export function createFormatContainer(): ContentModelFormatContainer {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'FormatContainer',
        blocks: [],
        format: {},
    };
}
