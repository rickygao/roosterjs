import { LIST_SELECTOR } from './constants';
import { unwrapElement } from './wacConverterUtils';

/**
 * Convert text copied from onenote online into text that's workable with rooster editor
 * @param doc Document that is being pasted into editor.
 */
export default function convertPastedContentFromOnenoteOnline(doc: HTMLDocument) {
    // Only problem with onenote list item structure is that when list indent
    // the new <ul>/<ol> is contained in the previous <li>. So this function is
    // moving all the <ul>/<ol>s in a <li> to be parallel as the <li>

    const listElements = doc.querySelectorAll(LIST_SELECTOR);
    listElements.forEach((element) => {
        // get the parent of <ul>/<ol>
        const listParentElement = element.parentElement;
        element.removeAttribute('style');
        // if the parent of list elements is a <li>, perceed with the unwrapping process.
        if (listParentElement && listParentElement.tagName == "LI") {
            // get the parent of <li> element.
            const parentsParentElement = listParentElement.parentElement;
            if (parentsParentElement) {
                const parentSibling = listParentElement.nextElementSibling;
                if (parentSibling) {
                    // if the <li> element has trailing siblings, then insert before
                    // the next sibling of the <li> element.
                    parentsParentElement.insertBefore(element, parentSibling);
                } else {
                    // if the <li> element does not have trailing sibling, the list should
                    // be appended at the end.
                    parentsParentElement.appendChild(element);
                }
            }
        }
    })

    const listItems = doc.querySelectorAll("LI");
    listItems.forEach((item) => {
        // style on the <li> element hides the list item style
        // and it need to be removed
        item.removeAttribute('style')
        // text content in <li> is wrapped with paragraph element,
        // which is causing tab to indent to fail. unwrap text content
        // from the <p> will solve the problem.
        unwrapElement(item, 'p');
    });
}
