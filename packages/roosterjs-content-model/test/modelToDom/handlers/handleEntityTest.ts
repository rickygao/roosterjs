import * as addDelimiters from 'roosterjs-editor-dom/lib/delimiter/addDelimiters';
import { ContentModelEntity } from '../../../lib/publicTypes/entity/ContentModelEntity';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { handleEntity } from '../../../lib/modelToDom/handlers/handleEntity';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleEntity', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
        spyOn(addDelimiters, 'default').and.callFake(() => {});
    });

    it('Simple block entity', () => {
        const div = document.createElement('div');
        const entityModel: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            id: 'entity_1',
            type: 'entity',
            isReadonly: true,
            wrapper: div,
        };

        const parent = document.createElement('div');

        handleEntity(document, parent, entityModel, context);

        expect(parent.innerHTML).toBe('<entity-placeholder id="entity_1"></entity-placeholder>');
        expect(context.entities).toEqual({
            entity_1: div,
        });
        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></div>'
        );
        expect(addDelimiters.default).toHaveBeenCalledTimes(0);
    });

    it('Fake entity', () => {
        const div = document.createElement('div');
        const entityModel: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            wrapper: div,
            isReadonly: true,
        };

        div.textContent = 'test';

        const parent = document.createElement('div');

        handleEntity(document, parent, entityModel, context);

        expect(parent.innerHTML).toBe('<div>test</div>');
        expect(context.entities).toEqual({});
        expect(div.outerHTML).toBe('<div>test</div>');
        expect(addDelimiters.default).toHaveBeenCalledTimes(0);
    });

    it('Simple inline readonly entity', () => {
        const span = document.createElement('span');
        const entityModel: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            id: 'entity_1',
            type: 'entity',
            isReadonly: true,
            wrapper: span,
        };

        const parent = document.createElement('div');
        context.experimentalFeatures = [ExperimentalFeatures.InlineEntityReadOnlyDelimiters];
        handleEntity(document, parent, entityModel, context);

        expect(parent.innerHTML).toBe('<entity-placeholder id="entity_1"></entity-placeholder>');
        expect(context.entities).toEqual({
            entity_1: span,
        });
        expect(span.outerHTML).toBe(
            '<span class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></span>'
        );
        expect(addDelimiters.default).toHaveBeenCalledTimes(1);
    });
});
