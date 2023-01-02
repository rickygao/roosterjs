import isContentModelEditor from '../../editor/isContentModelEditor';
import { createElement, readFile } from 'roosterjs-editor-dom';
import { CreateElementData } from 'roosterjs-editor-types';
import { insertContent } from 'roosterjs-content-model';
import { InsertImageButtonStringKey, RibbonButton } from 'roosterjs-react';

const FileInput: CreateElementData = {
    tag: 'input',
    attributes: {
        type: 'file',
        accept: 'image/*',
        display: 'none',
    },
};

/**
 * @internal
 * "Insert image" button on the format ribbon
 */
export const insertImageButton: RibbonButton<InsertImageButtonStringKey> = {
    key: 'buttonNameInsertImage',
    unlocalizedText: 'Insert image',
    iconName: 'Photo2',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            const document = editor.getDocument();
            const fileInput = createElement(FileInput, document) as HTMLInputElement;
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', () => {
                if (fileInput.files) {
                    for (let i = 0; i < fileInput.files.length; i++) {
                        readFile(fileInput.files[i], dataUrl => {
                            if (dataUrl && !editor.isDisposed()) {
                                const image = document.createElement('img');

                                image.src = dataUrl;
                                insertContent(editor, image);
                            }
                        });
                    }
                }
            });

            try {
                fileInput.click();
            } finally {
                document.body.removeChild(fileInput);
            }
        }
    },
};
