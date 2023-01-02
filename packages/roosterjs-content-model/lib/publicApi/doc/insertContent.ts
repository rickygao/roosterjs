import domToContentModel from '../domToContentModel';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { safeInstanceOf, wrap } from 'roosterjs-editor-dom';
import { setSelection } from '../../modelApi/selection/setSelection';

/**
 * Insert content
 * @param editor
 * @param htmlContent
 */
export default function insertContent(
    editor: IExperimentalContentModelEditor,
    htmlContent: string | DocumentFragment | HTMLElement | ContentModelDocument
) {
    formatWithContentModel(editor, 'insertContent', model => {
        if (typeof htmlContent === 'string') {
            const trustedHtmlHandler = editor.getTrustedHTMLHandler();
            const trustedHtml = trustedHtmlHandler(htmlContent);
            const doc = new DOMParser().parseFromString(trustedHtml, 'text/html');

            htmlContent = doc.body;
        }

        if (safeInstanceOf(htmlContent, 'DocumentFragment')) {
            htmlContent = wrap(htmlContent, 'div');
        }

        if (safeInstanceOf(htmlContent, 'HTMLElement')) {
            htmlContent = domToContentModel(htmlContent, editor.createEditorContext(), {
                includeRoot: true,
            });
        }

        setSelection(htmlContent);
        mergeModel(model, htmlContent);

        return true;
    });
}
