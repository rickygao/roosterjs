import isContentModelEditor from '../../editor/isContentModelEditor';
import { insertContent } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';

const htmlContent = '<table><tr><td>test</td></tr><tr><td>test2</td></tr></table>';

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
