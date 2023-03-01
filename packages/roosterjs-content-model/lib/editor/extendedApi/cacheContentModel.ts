import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * @internal
 */
export function getCachedContentModel(editor: IContentModelEditor): ContentModelDocument | null {
    return getCachedContentModelHolder(editor).model;
}

/**
 * @internal
 */
export function cacheContentModel(editor: IContentModelEditor, model: ContentModelDocument) {
    getCachedContentModelHolder(editor).model = model;
}

/**
 * @internal
 */
export function clearCachedContentModel(editor: IContentModelEditor) {
    getCachedContentModelHolder(editor).model = null;
}

interface CachedContentModelHolder {
    model: ContentModelDocument | null;
}

function getCachedContentModelHolder(editor: IContentModelEditor): CachedContentModelHolder {
    return editor.getCustomData(
        '__cachedContentModel',
        () => ({ model: null }),
        holder => (holder.model = null)
    );
}
