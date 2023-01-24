import { contains, getComputedStyles, processCssVariable } from 'roosterjs-editor-dom';
import {
    EditorCore,
    GetStyleBasedFormatState,
    ModeIndependentColor,
    NodeType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Get style based format state from current selection, including font name/size and colors
 * @param core The EditorCore objects
 * @param node The node to get style from
 */
export const getStyleBasedFormatState: GetStyleBasedFormatState = (
    core: EditorCore,
    node: Node | null
) => {
    if (!node) {
        return {};
    }

    let override: string[] = [];
    const pendableFormatSpan = core.pendingFormatState.pendableFormatSpan;

    if (pendableFormatSpan) {
        override = [
            pendableFormatSpan.style.fontFamily,
            pendableFormatSpan.style.fontSize,
            pendableFormatSpan.style.color,
            pendableFormatSpan.style.backgroundColor,
        ];
    }

    const styles = node ? getComputedStyles(node) : [];
    let styleTextColor: string | undefined;
    let styleBackColor: string | undefined;

    while (
        node &&
        contains(core.contentDiv, node, true /*treateSameNodeAsContain*/) &&
        !(styleTextColor && styleBackColor)
    ) {
        if (node.nodeType == NodeType.Element) {
            const element = node as HTMLElement;

            styleTextColor = styleTextColor || element.style.getPropertyValue('color');
            styleBackColor = styleBackColor || element.style.getPropertyValue('background-color');
        }
        node = node.parentNode;
    }

    if (!core.lifecycle.isDarkMode && node == core.contentDiv) {
        styleTextColor = styleTextColor || styles[2];
        styleBackColor = styleBackColor || styles[3];
    }

    const { lightColor: textColor, knownColor: textColors } = processColorVariable(
        core,
        override[2] || styleTextColor
    );
    const { lightColor: backgroundColor, knownColor: backgroundColors } = processColorVariable(
        core,
        override[3] || styleBackColor
    );

    return {
        fontName: override[0] || styles[0],
        fontSize: override[1] || styles[1],
        textColor,
        backgroundColor,
        textColors,
        backgroundColors,
    };
};

function processColorVariable(
    core: EditorCore,
    input: string | undefined
): {
    lightColor: string | undefined;
    knownColor: ModeIndependentColor | undefined;
} {
    let lightColor: string | undefined;
    let knownColor: ModeIndependentColor | undefined;

    if (input) {
        const match = processCssVariable(input);

        if (match) {
            lightColor = match[2];
            knownColor = core.lifecycle.knownDarkColors[match[1]];
        } else {
            lightColor = input;
        }
    }

    return { lightColor, knownColor };
}
