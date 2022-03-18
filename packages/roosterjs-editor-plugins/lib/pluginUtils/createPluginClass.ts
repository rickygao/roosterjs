import {
    IEditor,
    EditorPlugin,
    PluginEventFromType,
    PluginEventType,
    PluginEvent,
    DOMEventHandlerFunction,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export type EventHandlers<Context> = {
    [P in PluginEventType]?: (
        editor: IEditor,
        event: PluginEventFromType<P>,
        context: Context
    ) => void;
};

/**
 * @internal
 */
export type DOMEventHandlerFunctionWithContext<Context> = (
    editor: IEditor,
    event: Event,
    context: Context
) => void;

/**
 * @internal
 */
export default function createPluginClass<Creator extends (...args: any[]) => any>(
    name: string,
    contextCreator: Creator,
    onInitialize?: (editor: IEditor, context: ReturnType<Creator>) => void,
    onDispose?: (editor: IEditor, context: ReturnType<Creator>) => void,
    pluginEventHandlers?: EventHandlers<ReturnType<Creator>>,
    domEventHandlers?: Record<string, DOMEventHandlerFunctionWithContext<ReturnType<Creator>>>
): new () => EditorPlugin {
    return class AnonymousPlugin implements EditorPlugin {
        private name: string = name;
        private editor: IEditor;
        private disposer: () => void;
        private context: ReturnType<Creator>;

        constructor(...args: Parameters<Creator>) {
            this.context = contextCreator(...args);
        }

        initialize(editor: IEditor) {
            this.editor = editor;

            if (domEventHandlers) {
                const adjustedHandlers = Object.keys(domEventHandlers).reduce((v, key) => {
                    v[key] = (e: Event) => {
                        domEventHandlers[key]?.(this.editor, e, this.context);
                    };
                    return v;
                }, <Record<string, DOMEventHandlerFunction>>{});
                this.disposer = this.editor.addDomEventHandler(adjustedHandlers);
            }

            onInitialize?.(this.editor, this.context);
        }

        dispose() {
            onDispose?.(this.editor, this.context);

            this.disposer?.();
            this.disposer = null;
            this.editor = null;
        }

        getName() {
            return this.name;
        }

        onPluginEvent(event: PluginEvent) {
            this.handleEvent(pluginEventHandlers?.[event.eventType], event);
        }

        private handleEvent<T extends PluginEventType>(
            handler: (
                editor: IEditor,
                event: PluginEventFromType<T>,
                context: ReturnType<Creator>
            ) => void,
            event: PluginEventFromType<T>
        ) {
            handler?.(this.editor, event, this.context);
        }
    };
}
