import domToContentModel from '../domToContentModel';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { setSelection } from '../../modelApi/selection/setSelection';

/**
 * Insert content
 * @param editor
 * @param htmlContent
 */
export default function insertContent(
    editor: IExperimentalContentModelEditor,
    htmlContent: string
) {
    formatWithContentModel(editor, 'insertContent', model => {
        const trustedHtmlHandler = editor.getTrustedHTMLHandler();
        const trustedHtml = trustedHtmlHandler(htmlContent);
        const doc = new DOMParser().parseFromString(trustedHtml, 'text/html');
        const sourceModel = domToContentModel(doc.body, editor.createEditorContext(), {});

        setSelection(sourceModel);
        mergeModel(model, sourceModel);

        return true;
    });
}
