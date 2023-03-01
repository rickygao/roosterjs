import contentModelToDom from '../modelToDom/contentModelToDom';
import domToContentModel from '../domToModel/domToContentModel';
import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { DelimiterClasses, SelectionRangeTypes } from 'roosterjs-editor-types';
import { DomToModelContext } from '../publicTypes/context/DomToModelContext';
import { Editor } from 'roosterjs-editor-core';
import { EditorContext } from '../publicTypes/context/EditorContext';
import { Position, restoreContentWithEntityPlaceholder } from 'roosterjs-editor-dom';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { ShouldSkipProcessElementMap } from '../publicTypes/context/DomToModelSettings';
import {
    DomToModelOption,
    IContentModelEditor,
    ModelToDomOption,
} from '../publicTypes/IContentModelEditor';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelEditor extends Editor implements IContentModelEditor {
    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: DomToModelOption): ContentModelDocument {
        const core = this.getCore();

        return domToContentModel(core.contentDiv, this.createEditorContext(), {
            selectionRange: this.getSelectionRangeEx(),
            alwaysNormalizeTable: true,
            ...(option || {}),
            shouldSkipProcessElement: this.createShouldHandleElement(),
        });
    }

    private createShouldHandleElement(): Partial<ShouldSkipProcessElementMap> | undefined {
        return {
            child: (element: ParentNode, context: DomToModelContext): boolean =>
                !!isDelimiter(element, context),
        };
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption) {
        const [fragment, range, entityPairs] = contentModelToDom(
            this.getDocument(),
            model,
            this.createEditorContext(),
            option
        );
        const core = this.getCore();

        if (range?.type == SelectionRangeTypes.Normal) {
            // Need to get start and end from range position before merge because range can be changed during merging
            const start = Position.getStart(range.ranges[0]);
            const end = Position.getEnd(range.ranges[0]);

            restoreContentWithEntityPlaceholder(fragment, core.contentDiv, entityPairs);
            this.select(start, end);
        } else {
            restoreContentWithEntityPlaceholder(fragment, core.contentDiv, entityPairs);
            this.select(range);
        }
    }

    /**
     * Create a EditorContext object used by ContentModel API
     */
    private createEditorContext(): EditorContext {
        const core = this.getCore();

        return {
            isDarkMode: this.isDarkMode(),
            getDarkColor: core.lifecycle.getDarkColor,
            darkColorHandler: this.getDarkColorHandler(),
            experimentalFeatures: core.lifecycle.experimentalFeatures,
        };
    }
}

function isDelimiter(element: Node, context: DomToModelContext) {
    return (
        safeInstanceOf(element, 'HTMLSpanElement') &&
        (element.className === DelimiterClasses.DELIMITER_AFTER ||
            element.className === DelimiterClasses.DELIMITER_BEFORE) &&
        element.textContent === ZERO_WIDTH_SPACE
    );
}
