import handleBackspaceKey from '../../publicApi/editing/handleBackspaceKey';
import handleDeleteKey from '../../publicApi/editing/handleDeleteKey';
import { EditPlugin } from 'roosterjs-editor-core';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    BuildInEditFeature,
    GenericContentEditFeature,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

// Make sure we add the keys that Content Model can handle here each time we add a new key.
// Forgetting adding keys here will trigger a build time error in the switch block in function onPluginEvent()
const HandledKeyMap = {
    [Keys.DELETE]: true,
    [Keys.BACKSPACE]: true,
};
const HandleKeys = Object.keys(HandledKeyMap).map(x => parseInt(x));

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Delete Key
 * 2. Backspace Key
 */
export default class ContentModelEditPlugin extends EditPlugin {
    private cmEditor: IContentModelEditor | null = null;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelEdit';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        // TODO: Later we may need a different interface for Content Model editor plugin
        this.cmEditor = editor as IContentModelEditor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.cmEditor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        super.onPluginEvent(event);

        if (
            this.cmEditor &&
            event.eventType == PluginEventType.KeyDown &&
            !event.rawEvent.defaultPrevented
        ) {
            const key = event.rawEvent.which as keyof typeof HandledKeyMap;

            // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
            switch (key) {
                case Keys.BACKSPACE:
                    handleBackspaceKey(this.cmEditor, event.rawEvent);
                    break;

                case Keys.DELETE:
                    handleDeleteKey(this.cmEditor, event.rawEvent);
                    break;
            }
        }
    }

    protected shouldSkipFeature(
        feature: GenericContentEditFeature<PluginEvent>,
        rawEvent: KeyboardEvent
    ) {
        return (
            HandleKeys.indexOf(rawEvent.which) >= 0 &&
            !!(<BuildInEditFeature<PluginEvent>>feature).skipForContentModel
        );
    }
}
