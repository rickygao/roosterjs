import { cacheContentModel, getCachedContentModel } from './cacheContentModel';
import { ChangeSource, ExperimentalFeatures } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { DomToModelOption, IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * @internal
 */
export function formatWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    callback: (model: ContentModelDocument) => boolean,
    domToModelOptions?: DomToModelOption
) {
    const reuseContentModel = editor.isFeatureEnabled(ExperimentalFeatures.ReusableContentModel);
    const cachedModel = reuseContentModel ? getCachedContentModel(editor) : null;
    const model = cachedModel || editor.createContentModel(domToModelOptions);

    if (callback(model)) {
        editor.addUndoSnapshot(
            () => {
                editor.focus();
                if (model) {
                    editor.setContentModel(model);
                }
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: apiName,
            }
        );

        if (reuseContentModel) {
            cacheContentModel(editor, model);
        }
    }
}
