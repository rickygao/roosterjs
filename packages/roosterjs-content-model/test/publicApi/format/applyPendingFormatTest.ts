import * as formatWithContentModel from '../../../lib/editor/extendedApi/formatWithContentModel';
import * as iterateSelections from '../../../lib/modelApi/selection/iterateSelections';
import * as pendingFormat from '../../../lib/editor/extendedApi/pendingFormat';
import applyPendingFormat from '../../../lib/publicApi/format/applyPendingFormat';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../../../lib/publicTypes/segment/ContentModelSelectionMarker';
import { ContentModelText } from '../../../lib/publicTypes/segment/ContentModelText';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('applyPendingFormat', () => {
    it('Has pending format', () => {
        const editor = ({} as any) as IContentModelEditor;
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
        };
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text, marker],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_, apiName, callback) => {
                expect(apiName).toEqual('applyPendingFormat');
                callback(model);
            }
        );
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [marker]);
            return false;
        });

        applyPendingFormat(editor, 'c');

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'ab',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'c',
                            format: {
                                fontSize: '10px',
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

    it('Has pending format but wrong text', () => {
        const editor = ({} as any) as IContentModelEditor;
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
        };
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text, marker],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_, apiName, callback) => {
                expect(apiName).toEqual('applyPendingFormat');
                callback(model);
            }
        );
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [marker]);
            return false;
        });

        applyPendingFormat(editor, 'd');

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'abc',
                            format: {},
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

    it('No pending format', () => {
        const editor = ({} as any) as IContentModelEditor;
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
        };
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text, marker],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(null);

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_, apiName, callback) => {
                expect(apiName).toEqual('applyPendingFormat');
                callback(model);
            }
        );
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [marker]);
            return false;
        });

        applyPendingFormat(editor, 'd');

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'abc',
                            format: {},
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

    it('Selection is not collapsed', () => {
        const editor = ({} as any) as IContentModelEditor;
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
            isSelected: true,
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_, apiName, callback) => {
                expect(apiName).toEqual('applyPendingFormat');
                callback(model);
            }
        );
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [text]);
            return false;
        });

        applyPendingFormat(editor, 'd');

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'abc',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });
});
