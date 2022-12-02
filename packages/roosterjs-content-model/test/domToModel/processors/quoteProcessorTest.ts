import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { quoteProcessor } from '../../../lib/domToModel/processors/quoteProcessor';

describe('quoteProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty BLOCKQUOTE tag', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginTop: '1em',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {
                        marginRight: '40px',
                        marginLeft: '40px',
                    },
                },
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginBottom: '1em',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('BLOCKQUOTE with non-zero value style', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '1px';
        quote.style.marginBottom = '0';

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginTop: '1px',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {
                        marginRight: '40px',
                        marginBottom: '0px',
                        marginLeft: '40px',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('BLOCKQUOTE with other style', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';
        quote.style.color = 'red';
        quote.appendChild(document.createTextNode('test'));

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {
                                textColor: 'red',
                            },
                            text: 'test',
                        },
                    ],
                    format: {
                        marginTop: '0px',
                        marginRight: '40px',
                        marginBottom: '0px',
                        marginLeft: '40px',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('BLOCKQUOTE with margin and border', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';
        quote.style.border = 'solid 1px black';

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [],
                    format: {
                        marginTop: '0px',
                        marginRight: '40px',
                        marginBottom: '0px',
                        marginLeft: '40px',
                        borderTop: '1px solid black',
                        borderRight: '1px solid black',
                        borderBottom: '1px solid black',
                        borderLeft: '1px solid black',
                    },
                },
            ],
        });
    });

    xit('Nested BLOCKQUOTE with left margin and border', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');
        const div = document.createElement('div');

        quote.style.borderLeft = 'solid 2px black';
        quote.style.marginLeft = '40px';
        div.style.marginLeft = '60px';
        div.appendChild(document.createTextNode('test2'));

        quote.appendChild(document.createTextNode('test1'));
        quote.appendChild(div);
        quote.appendChild(document.createTextNode('test3'));

        quoteProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                },
                            ],
                            format: {
                                marginLeft: '60px',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test3',
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        borderLeft: '2px solid black',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });
});
