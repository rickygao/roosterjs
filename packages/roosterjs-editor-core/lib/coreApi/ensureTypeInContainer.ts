import {
    ContentPosition,
    EditorCore,
    EnsureTypeInContainer,
    PositionType,
} from 'roosterjs-editor-types';
import {
    applyFormat,
    Browser,
    createRange,
    fromHtml,
    getBlockElementAtNode,
    isNodeEmpty,
    Position,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

/**
 * When typing goes directly under content div, many things can go wrong
 * We fix it by wrapping it with a div and reposition cursor within the div
 */
export const ensureTypeInContainer: EnsureTypeInContainer = (
    core: EditorCore,
    keyboardEvent?: KeyboardEvent
) => {
    const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

    if (!range) {
        return null;
    }

    let result = Position.getStart(range).normalize();
    const block = getBlockElementAtNode(core.contentDiv, result.node);
    let formatNode: HTMLElement;

    if (block) {
        formatNode = block.collapseToSingleElement();

        // if the block is empty, apply default format
        // Otherwise, leave it as it is as we don't want to change the style for existing data
        // unless the block was just created by the keyboard event (e.g. ctrl+a & start typing)
        const shouldSetNodeStyles =
            isNodeEmpty(formatNode) ||
            (keyboardEvent && wasNodeJustCreatedByKeyboardEvent(keyboardEvent, formatNode));
        formatNode = formatNode && shouldSetNodeStyles ? formatNode : null;
    } else {
        // Only reason we don't get the selection block is that we have an empty content div
        // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
        // The fix is to add a DIV wrapping, apply default format and move cursor over
        formatNode = fromHtml(
            Browser.isEdge ? '<div><span><br></span></div>' : '<div><br></div>',
            core.contentDiv.ownerDocument
        )[0] as HTMLElement;
        core.api.insertNode(core, formatNode, {
            position: ContentPosition.End,
            updateCursor: false,
            replaceSelection: false,
            insertOnNewLine: false,
        });

        // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
        result = new Position(formatNode.firstChild, PositionType.Begin);
    }

    if (formatNode) {
        applyFormat(formatNode, core.lifecycle.defaultFormat, core.lifecycle.isDarkMode);
    }

    // If this is triggered by a keyboard event, let's select the new position
    if (keyboardEvent) {
        core.api.selectRange(core, createRange(result));
    }
};

function wasNodeJustCreatedByKeyboardEvent(event: KeyboardEvent, formatNode: HTMLElement) {
    return (
        safeInstanceOf(event.target, 'Node') &&
        event.target.contains(formatNode) &&
        event.key === formatNode.innerText
    );
}
