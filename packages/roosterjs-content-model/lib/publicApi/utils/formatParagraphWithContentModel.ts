import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelections } from '../../modelApi/selection/getSelections';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 */
export function formatParagraphWithContentModel(
    editor: IExperimentalContentModelEditor,
    apiName: string,
    setStyleCallback: (paragraph: ContentModelParagraph) => void
) {
    formatWithContentModel(editor, apiName, model => {
        let result = false;

        getSelections(model).forEach(({ block }) => {
            if (block?.blockType == 'Paragraph') {
                result = true;
                setStyleCallback(block);
            }
        });

        return result;
    });
}
