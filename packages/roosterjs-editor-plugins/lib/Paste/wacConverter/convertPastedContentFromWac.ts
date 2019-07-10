import { HtmlSanitizer } from 'roosterjs-html-sanitizer';
import convertPastedContentFromWordOnline from './convertPastedContentFromWordOnline';
import convertPastedContentFromOnenoteOnline from './convertPastedContentFromOnenoteOnline';
import {
    WORD_LIST_CONTAINER_ELEMENT_CLASS_NAME
} from './constants';

export default function convertPastedContentFromWac(doc: HTMLDocument) {
    // The class name "ListWrapperContainer" only exists in word
    if (
        doc.getElementsByClassName(WORD_LIST_CONTAINER_ELEMENT_CLASS_NAME).length > 0
    ) {
        convertPastedContentFromWordOnline(doc);
    } else {
        convertPastedContentFromOnenoteOnline(doc);
    }

    let sanitizer = new HtmlSanitizer({
        elementCallbacks: {
            ['O:P']: () => false,
        },
        additionalAllowAttributes: ['class'],
    });
    sanitizer.sanitize(doc.body);
}
