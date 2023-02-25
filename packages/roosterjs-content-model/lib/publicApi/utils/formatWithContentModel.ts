import {
    cacheContentModel,
    getCachedContentModel,
} from '../../editor/extendedApi/cacheContentModel';
import { ChangeSource, ExperimentalFeatures } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { DomToModelOption, IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';

/**
 * @internal
 */
export function formatWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    callback: (model: ContentModelDocument) => boolean,
    domToModelOptions?: DomToModelOption,
    preservePendingFormat?: boolean
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

                if (preservePendingFormat) {
                    const pendingFormat = getPendingFormat(editor);
                    const pos = editor.getFocusedPosition();

                    if (pendingFormat && pos) {
                        setPendingFormat(editor, pendingFormat, pos);
                    }
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
