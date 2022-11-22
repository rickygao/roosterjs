import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelFormatContainer } from '../../../lib/publicTypes/group/ContentModelFormatContainer';
import { ContentModelGeneralBlock } from '../../../lib/publicTypes/group/ContentModelGeneralBlock';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelListItem } from '../../../lib/publicTypes/group/ContentModelListItem';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createFormatContainer } from '../../../lib/modelApi/creators/createFormatContainer';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleBlockGroup } from '../../../lib/modelToDom/handlers/handleBlockGroup';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleBlockGroup', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;
    let handleListItem: jasmine.Spy<ContentModelHandler<ContentModelListItem>>;
    let handleFormatContainer: jasmine.Spy<ContentModelHandler<ContentModelFormatContainer>>;
    let handleGeneralModel: jasmine.Spy<ContentModelHandler<ContentModelGeneralBlock>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        handleListItem = jasmine.createSpy('handleListItem');
        handleFormatContainer = jasmine.createSpy('handleFormatContainer');
        handleGeneralModel = jasmine.createSpy('handleGeneralModel');

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildren,
                listItem: handleListItem,
                formatContainer: handleFormatContainer,
                general: handleGeneralModel,
            },
        });
        parent = document.createElement('div');
    });

    it('Document', () => {
        const group = createContentModelDocument();

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, parent, group, context);
    });

    it('General block', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
        } as any) as HTMLElement;
        const group = createGeneralBlock(childMock);

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleGeneralModel).toHaveBeenCalledTimes(1);
        expect(handleGeneralModel).toHaveBeenCalledWith(document, parent, group, context);
    });

    it('Format Container', () => {
        const group = createFormatContainer();

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleFormatContainer).toHaveBeenCalledTimes(1);
        expect(handleFormatContainer).toHaveBeenCalledWith(document, parent, group, context);
    });

    it('ListItem', () => {
        const group = createListItem([]);

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleListItem).toHaveBeenCalledTimes(1);
        expect(handleListItem).toHaveBeenCalledWith(document, parent, group, context);
    });
});
