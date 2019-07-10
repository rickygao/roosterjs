import { WAC_IDENTIFYING_SELECTOR } from './constants';

export function isWAC(node: HTMLElement): boolean {
    if (node) {
        return node.querySelector(WAC_IDENTIFYING_SELECTOR) ? true : false;
    }
    return false;
}

export function unwrapElement(parentElement: Element, wrapperSelector: string) {
    const wrapperElement = parentElement.querySelector(wrapperSelector);
    const wrapperElementParent = wrapperElement.parentElement;
    if (wrapperElementParent) {
        const wrapperElementSibling = wrapperElement.nextElementSibling;
        wrapperElementParent.removeChild(wrapperElement);
        const { children } = wrapperElement;
        for (let i = 0; i < children.length; i++) {
            if (wrapperElementSibling) {
                wrapperElementParent.insertBefore(children[i], wrapperElementSibling);
            } else {
                wrapperElementParent.appendChild(children[i]);
            }
        }
    }
}