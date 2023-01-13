import insertLink from '../../../lib/publicApi/link/insertLink';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { HyperLinkColorPlaceholder } from '../../../lib/formatHandlers/utils/defaultStyles';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('insertLink', () => {
    let editor: IExperimentalContentModelEditor;
    let setContentModel: jasmine.Spy<IExperimentalContentModelEditor['setContentModel']>;
    let createContentModel: jasmine.Spy<IExperimentalContentModelEditor['createContentModel']>;

    beforeEach(() => {
        setContentModel = jasmine.createSpy('setContentModel');
        createContentModel = jasmine.createSpy('createContentModel');

        editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: Function) => callback(),
            setContentModel,
            createContentModel,
        } as any) as IExperimentalContentModelEditor;
    });

    function runTest(
        model: ContentModelDocument,
        url: string,
        expectedModel: ContentModelDocument | null,
        title?: string,
        displayText?: string,
        target?: string
    ) {
        createContentModel.and.returnValue(model);

        insertLink(editor, url, title, displayText, target);

        if (expectedModel) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(expectedModel);
        } else {
            expect(setContentModel).not.toHaveBeenCalled();
        }
    }

    it('Empty link string', () => {
        runTest(createContentModelDocument(), '', null);
    });

    it('Valid url', () => {
        const doc = createContentModelDocument();
        addSegment(doc, createSelectionMarker());
        runTest(doc, 'http://test.com', {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {
                                underline: true,
                                textColor: HyperLinkColorPlaceholder,
                            },
                            text: 'http://test.com',
                            link: {
                                dataset: {},
                                format: {
                                    href: 'http://test.com',
                                    anchorTitle: undefined,
                                    target: undefined,
                                },
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Valid url on existing text, no display text', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(doc, 'http://test.com', {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {
                                underline: true,
                                textColor: HyperLinkColorPlaceholder,
                            },
                            text: 'test',
                            link: {
                                dataset: {},
                                format: {
                                    href: 'http://test.com',
                                    anchorTitle: undefined,
                                    target: undefined,
                                },
                            },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });
});
