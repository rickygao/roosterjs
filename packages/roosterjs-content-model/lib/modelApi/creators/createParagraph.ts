import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelParagraphFormat } from '../../publicTypes/format/ContentModelParagraphFormat';

/**
 * @internal
 */
export function createParagraph(
    isImplicit?: boolean,
    format?: ContentModelParagraphFormat
): ContentModelParagraph {
    const result: ContentModelParagraph = {
        blockType: 'Paragraph',
        segments: [],
        format: format ? { ...format } : {},
    };

    if (isImplicit) {
        result.isImplicit = true;
    }

    return result;
}
