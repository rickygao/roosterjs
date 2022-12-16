import isContentModelEditor from '../../editor/isContentModelEditor';
import { insertContent } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';

const htmlContent = 'aa<div>bb</div>cc';

/**
 * @internal
 * "Right to left" button on the format ribbon
 */
export const tempInsertButton: RibbonButton<'insert'> = {
    key: 'insert',
    unlocalizedText: 'Insert',
    iconName: 'Insert',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            insertContent(editor, htmlContent);
        }

        return true;
    },
};
