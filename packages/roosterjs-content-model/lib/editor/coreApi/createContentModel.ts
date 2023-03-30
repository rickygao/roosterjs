import domToContentModel from '../../domToModel/domToContentModel';
import { CreateContentModel } from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export const createContentModel: CreateContentModel = (core, option) => {
    const cachedModel = core.reuseModel && !option?.ignoreCache ? core.cachedModel : null;

    return (
        cachedModel ||
        domToContentModel(core.contentDiv, core.api.createEditorContext(core), {
            selectionRange: core.api.getSelectionRangeEx(core),
            alwaysNormalizeTable: true,
            ...(option || {}),
        })
    );
};
