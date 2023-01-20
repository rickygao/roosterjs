import { arrayPush, safeInstanceOf, toArray } from 'roosterjs-editor-dom';
import { ColorTransformDirection, EditorCore, TransformColor } from 'roosterjs-editor-types';
import type { CompatibleColorTransformDirection } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 * Edit and transform color of elements between light mode and dark mode
 * @param core The EditorCore object
 * @param rootNode The root HTML elements to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param callback The callback function to invoke before do color transformation
 * @param direction To specify the transform direction, light to dark, or dark to light
 * @param forceTransform By default this function will only work when editor core is in dark mode.
 * Pass true to this value to force do color transformation even editor core is in light mode
 */
export const transformColor: TransformColor = (
    core: EditorCore,
    rootNode: Node | null,
    includeSelf: boolean,
    callback: (() => void) | null,
    direction: ColorTransformDirection | CompatibleColorTransformDirection,
    forceTransform?: boolean
) => {
    const elements =
        rootNode && (forceTransform || core.lifecycle.isDarkMode)
            ? getAll(rootNode, includeSelf)
            : [];

    callback?.();

    if (direction == ColorTransformDirection.DarkToLight) {
        transformToLightMode(elements);
    } else if (core.lifecycle.onExternalContentTransform) {
        elements.forEach(element => core.lifecycle.onExternalContentTransform!(element));
    } else {
        transformToDarkMode(elements, core.lifecycle.getDarkColor, core.contentDiv);
    }
};

const ColorNamePrefix = '--darkColor_';
const DarkColorRegex = /^\s*var\(\s*(\-\-[a-zA-Z0-9\-_]+)\s*(?:,\s*(.*))?\)\s*$/;

function transformToLightMode(elements: HTMLElement[]) {
    elements.forEach(element => {
        internalTransformToLightMode(element, 'color');
        internalTransformToLightMode(element, 'background-color');
    });
}

function transformToDarkMode(
    elements: HTMLElement[],
    getDarkColor: (color: string) => string,
    contentDiv: HTMLElement
) {
    const knownColorKeys: string[] = [];
    elements.forEach(element => {
        [
            internalTransformToDarkColor(element, 'color', 'color'),
            internalTransformToDarkColor(element, 'background-color', 'bgcolor'),
        ].forEach(keyAndValue => {
            if (keyAndValue && knownColorKeys.indexOf(keyAndValue[0]) < 0) {
                contentDiv.style.setProperty(keyAndValue[0], getDarkColor(keyAndValue[1]));
                knownColorKeys.push(keyAndValue[0]);
            }
        });
    });
}

function internalTransformToLightMode(element: HTMLElement, cssName: string) {
    const color = element.style.getPropertyValue(cssName);

    if (color && color != 'inherit') {
        const matches = DarkColorRegex.exec(color);
        let lightColor = matches ? matches[2] : color;

        if (lightColor) {
            element.style.setProperty(cssName, lightColor);
        } else {
            element.style.removeProperty(cssName);
        }
    }
}

function internalTransformToDarkColor(
    element: HTMLElement,
    cssName: string,
    attrName: string
): [string, string] | void {
    let color = element.style.getPropertyValue(cssName) || element.getAttribute(attrName);

    if (color && color != 'inherit') {
        const matches = DarkColorRegex.exec(color);

        if (matches) {
            color = matches[2];
        }

        if (color) {
            const colorKey = ColorNamePrefix + color.replace(/[^\d\w]/g, '_');
            element.style.setProperty(cssName, `var(${colorKey},${color})`, 'important');

            return [colorKey, color];
        }
    }
}

function getAll(rootNode: Node, includeSelf: boolean): HTMLElement[] {
    const result: HTMLElement[] = [];

    if (safeInstanceOf(rootNode, 'HTMLElement')) {
        if (includeSelf) {
            result.push(rootNode);
        }
        const allChildren = rootNode.getElementsByTagName('*');
        arrayPush(result, toArray(allChildren));
    } else if (safeInstanceOf(rootNode, 'DocumentFragment')) {
        const allChildren = rootNode.querySelectorAll('*');
        arrayPush(result, toArray(allChildren));
    }

    return result.filter(isHTMLElement);
}

// This is not a strict check, we just need to make sure this element has style so that we can set style to it
// We don't use safeInstanceOf() here since this function will be called very frequently when extract html content
// in dark mode, so we need to make sure this check is fast enough
function isHTMLElement(element: Element): element is HTMLElement {
    const htmlElement = <HTMLElement>element;
    return !!htmlElement.style && !!htmlElement.dataset;
}
