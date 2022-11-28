import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { defaultImplicitSegmentFormatMap } from '../../formatHandlers/utils/defaultStyles';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

type HeaderLevelTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Set header level of selected paragraphs
 * @param editor The editor to set header level to
 * @param headerLevel Level of header, from 1 to 6. Set to 0 means set it back to a regular paragraph
 */
export default function setHeaderLevel(
    editor: IExperimentalContentModelEditor,
    headerLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6
) {
    formatParagraphWithContentModel(editor, 'setHeaderLevel', para => {
        const tagName =
            headerLevel > 0
                ? (('h' + headerLevel) as HeaderLevelTags | null)
                : getExistingHeaderHeaderTag(para.decorator);
        const headerStyle =
            (tagName && (defaultImplicitSegmentFormatMap[tagName] as ContentModelSegmentFormat)) ||
            {};

        if (headerLevel > 0) {
            para.decorator = {
                tagName: tagName!,
                format: { ...headerStyle },
            };

            para.segments.forEach(segment => {
                Object.assign(segment.format, headerStyle);
            });
        } else if (tagName) {
            delete para.decorator;

            para.segments.forEach(segment => {
                getObjectKeys(headerStyle).forEach(key => {
                    delete segment.format[key];
                });
            });
        }
    });
}

function getExistingHeaderHeaderTag(
    decorator?: ContentModelParagraphDecorator
): HeaderLevelTags | null {
    const tag = decorator?.tagName || '';
    const level = parseInt(tag.substring(1));

    return level >= 1 && level <= 6 ? (tag as HeaderLevelTags) : null;
}
