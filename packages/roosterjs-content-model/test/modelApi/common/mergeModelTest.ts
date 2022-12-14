import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { mergeModel } from '../../../lib/modelApi/common/mergeModel';

describe('mergeModel', () => {
    it('empty to empty', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        mergeModel(majorModel, sourceModel);

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('empty to single selection', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        majorModel.blocks.push(para);

        mergeModel(majorModel, sourceModel);

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('para to single selection', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        para2.segments.push(text1, text2);
        sourceModel.blocks.push(para2);

        mergeModel(majorModel, sourceModel);

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('para to para with text selection, with format', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText('test2', { textColor: 'green' });

        const para2 = createParagraph();
        const text3 = createText('test3', { textColor: 'blue' });
        const text4 = createText('test4', { textColor: 'yellow' });

        text2.isSelected = true;

        para1.segments.push(text1, text2);
        para2.segments.push(text3, text4);

        majorModel.blocks.push(para1);
        sourceModel.blocks.push(para2);

        mergeModel(majorModel, sourceModel);

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {
                                textColor: 'red',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test3',
                            format: {
                                textColor: 'blue',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {
                                textColor: 'yellow',
                            },
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                textColor: 'green',
                            },
                        },
                        {
                            segmentType: 'Br',
                            format: {
                                textColor: 'green',
                            },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });
});

//         console.log(JSON.stringify(majorModel, null, 4));
