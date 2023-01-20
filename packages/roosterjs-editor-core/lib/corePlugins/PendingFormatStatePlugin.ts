import { isCharacterValue, Position } from 'roosterjs-editor-dom';
import {
    IEditor,
    Keys,
    NodePosition,
    PendingFormatStatePluginState,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    PositionType,
} from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * @internal
 * PendingFormatStatePlugin handles pending format state management
 */
export default class PendingFormatStatePlugin
    implements PluginWithState<PendingFormatStatePluginState> {
    private editor: IEditor | null = null;
    private state: PendingFormatStatePluginState;

    /**
     * Construct a new instance of PendingFormatStatePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor() {
        this.state = {
            pendableFormatPosition: null,
            pendableFormatState: null,
            pendableFormatSpan: null,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'PendingFormatState';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.clear();
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.PendingFormatStateChanged:
                // Got PendingFormatStateChanged event, cache current position and pending format if a format is passed in
                // otherwise clear existing pending format.
                if (event.formatState) {
                    this.state.pendableFormatPosition = this.getCurrentPosition();
                    this.state.pendableFormatState = event.formatState;
                    this.state.pendableFormatSpan = event.formatCallback
                        ? this.createPendingFormatSpan(event.formatCallback)
                        : null;
                } else {
                    this.clear();
                }

                break;
            case PluginEventType.KeyDown:
            case PluginEventType.MouseDown:
            case PluginEventType.ContentChanged:
                let currentPosition: NodePosition | null = null;
                if (
                    this.editor &&
                    event.eventType == PluginEventType.KeyDown &&
                    isCharacterValue(event.rawEvent) &&
                    this.state.pendableFormatSpan
                ) {
                    this.state.pendableFormatSpan.removeAttribute('contentEditable');
                    this.editor.insertNode(this.state.pendableFormatSpan);
                    this.editor.select(
                        this.state.pendableFormatSpan,
                        PositionType.Before,
                        this.state.pendableFormatSpan,
                        PositionType.End
                    );
                    this.clear();
                } else if (
                    (event.eventType == PluginEventType.KeyDown &&
                        event.rawEvent.which >= Keys.PAGEUP &&
                        event.rawEvent.which <= Keys.DOWN) ||
                    (this.state.pendableFormatPosition &&
                        (currentPosition = this.getCurrentPosition()) &&
                        !this.state.pendableFormatPosition.equalTo(currentPosition))
                ) {
                    // If content or position is changed (by keyboard, mouse, or code),
                    // check if current position is still the same with the cached one (if exist),
                    // and clear cached format if position is changed since it is out-of-date now
                    this.clear();
                }

                break;
        }
    }

    private clear() {
        this.state.pendableFormatPosition = null;
        this.state.pendableFormatState = null;
        this.state.pendableFormatSpan = null;
    }

    private getCurrentPosition() {
        let range = this.editor?.getSelectionRange();
        return (range && Position.getStart(range).normalize()) ?? null;
    }

    private createPendingFormatSpan(
        callback: (element: HTMLElement, isInnerNode?: boolean) => any
    ) {
        let span = this.state.pendableFormatSpan;

        if (!span && this.editor) {
            const currentStyle = this.editor.getStyleBasedFormatState();
            const doc = this.editor.getDocument();

            span = doc.createElement('span');
            span.contentEditable = 'true';
            span.appendChild(doc.createTextNode(ZERO_WIDTH_SPACE));

            span.style.setProperty('font-family', currentStyle.fontName ?? null);
            span.style.setProperty('font-size', currentStyle.fontSize ?? null);

            const textColor = currentStyle.textColors || currentStyle.textColor;
            const backColor = currentStyle.backgroundColors || currentStyle.backgroundColor;

            if (textColor) {
                this.editor.setColorToElement(span, textColor, 'color');
            }

            if (backColor) {
                this.editor.setColorToElement(span, backColor, 'background-color');
            }
        }

        if (span) {
            callback(span);
        }

        return span;
    }
}
