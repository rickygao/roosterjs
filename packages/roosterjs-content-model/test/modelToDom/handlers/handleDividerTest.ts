import { ContentModelDivider } from '../../../lib/publicTypes/block/ContentModelDivider';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleDivider } from '../../../lib/modelToDom/handlers/handleDivider';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleDivider', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
    });

    it('Simple HR', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'HR',
            format: {},
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<hr>');
    });

    it('HR with format', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'HR',
            format: { marginTop: '10px' },
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<hr style="margin-top: 10px;">');
    });
});
