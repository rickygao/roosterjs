import createPluginClass from '../../pluginUtils/createPluginClass';
import { ChangeSource, EditorPluginClass, IEditor, PluginEventType } from 'roosterjs-editor-types';
import { experimentCommitListChains } from 'roosterjs-editor-api';
import { VListChain } from 'roosterjs-editor-dom';

interface CutPasteListChainContext {
    chains: VListChain[];
    expectedChangeSource: string;
}

/**
 * Maintain list numbers of list chain when content is modified by cut/paste/drag&drop
 */
export const CutPasteListChain: EditorPluginClass = createPluginClass(
    'CutPasteListChain',
    () => ({
        chains: <VListChain[]>[],
        expectedChangeSource: <ChangeSource>null,
    }),
    null,
    null,
    {
        [PluginEventType.BeforeCutCopy]: (editor, event, context) => {
            if (event.isCut) {
                cacheListChains(editor, ChangeSource.Cut, context);
            }
        },
        [PluginEventType.BeforePaste]: (editor, event, context) => {
            cacheListChains(editor, ChangeSource.Paste, context);
        },
        [PluginEventType.ContentChanged]: (editor, event, context) => {
            if (context.chains?.length > 0 && context.expectedChangeSource == event.source) {
                experimentCommitListChains(editor, context.chains);
                context.chains = null;
                context.expectedChangeSource = null;
            }
        },
    },
    {
        drop: (editor, event, context) => {
            cacheListChains(editor, ChangeSource.Drop, context);
        },
    }
);

function cacheListChains(editor: IEditor, source: ChangeSource, context: CutPasteListChainContext) {
    context.chains = VListChain.createListChains(editor.getSelectedRegions());
    context.expectedChangeSource = source;
}
