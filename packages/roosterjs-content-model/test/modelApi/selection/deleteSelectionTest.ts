import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { deleteSelection } from '../../../lib/modelApi/selection/deleteSelection';
import { getSelections } from '../../../lib/modelApi/selection/getSelections';
import {
    ContentModelSegmentsSelection,
    ContentModelSelection,
} from '../../../lib/publicTypes/selection/ContentModelSelection';

describe('deleteSelection', () => {
    it('empty selection', () => {
        const para = createParagraph();
        const selection: ContentModelSelection = {
            type: 'Segments',
            paragraph: para,
            path: [],
            segments: [],
        };

        deleteSelection(selection);

        expect(selection).toEqual({
            type: 'Segments',
            paragraph: para,
            path: [],
            segments: [],
        });
    });

    it('Single selection marker', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });

        para.segments.push(marker);
        model.blocks.push(para);

        deleteSelection(getSelections(model)[0]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Single text selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test1', { fontSize: '10px' });

        text.isSelected = true;
        para.segments.push(text);
        model.blocks.push(para);

        deleteSelection(getSelections(model)[0]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Multiple text selection in multiple paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text0 = createText('test0', { fontSize: '10px' });
        const text1 = createText('test1', { fontSize: '11px' });
        const text2 = createText('test2', { fontSize: '12px' });

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text0);
        para1.segments.push(text1);
        para2.segments.push(text2);

        model.blocks.push(para1);
        model.blocks.push(para2);

        const selections = getSelections(model);
        selections.forEach(s => deleteSelection(s, selections[0] as ContentModelSegmentsSelection));

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test0',
                            format: { fontSize: '10px' },
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Divider selection', () => {
        const model = createContentModelDocument();
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const selections = getSelections(model);
        selections.forEach(s => deleteSelection(s));

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });
});
