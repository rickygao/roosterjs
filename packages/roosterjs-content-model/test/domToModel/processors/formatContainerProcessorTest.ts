import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { formatContainerProcessor } from '../../../lib/domToModel/processors/formatContainerProcessor';

describe('formatContainerProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty BLOCKQUOTE tag', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        formatContainerProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                        marginRight: '40px',
                        marginLeft: '40px',
                    },
                },
            ],
        });
    });

    it('BLOCKQUOTE with non-zero value style', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '1px';
        quote.style.marginBottom = '0';

        formatContainerProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1px',
                        marginBottom: '0px',
                        marginRight: '40px',
                        marginLeft: '40px',
                    },
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

        formatContainerProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    format: {
                        marginRight: '40px',
                        marginLeft: '40px',
                        textColor: 'red',
                        marginTop: '0px',
                        marginBottom: '0px',
                    },
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'test',
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
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

        formatContainerProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
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

    it('Nested BLOCKQUOTE with left margin and border', () => {
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

        formatContainerProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
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
            ],
        });
    });

    it('Verify inherited formats are correctly handled', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');
        const childProcessor = jasmine
            .createSpy('childProcessor')
            .and.callFake((group, element, context) => {
                expect(context.blockFormat).toEqual({
                    backgroundColor: 'red',
                });
                expect(context.segmentFormat).toEqual({
                    fontSize: '20px',
                });
            });

        quote.style.color = 'blue';
        quote.style.borderLeft = 'solid 1px black';
        context.blockFormat.backgroundColor = 'red';
        context.segmentFormat.textColor = 'green';
        context.segmentFormat.fontSize = '20px';
        context.elementProcessors.child = childProcessor;

        formatContainerProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        borderLeft: '1px solid black',
                        backgroundColor: 'red',
                        textColor: 'blue',
                    },
                },
            ],
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('Verify inherited formats from context are correctly handled', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');
        const childProcessor = jasmine.createSpy('childProcessor');

        quote.style.borderLeft = 'solid 1px black';

        context.blockFormat.backgroundColor = 'red';
        context.blockFormat.textAlign = 'center';
        context.blockFormat.isTextAlignFromAttr = true;
        context.blockFormat.lineHeight = '2';
        context.blockFormat.whiteSpace = 'pre';
        context.blockFormat.direction = 'rtl';

        context.elementProcessors.child = childProcessor;

        formatContainerProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        borderLeft: '1px solid black',
                        backgroundColor: 'red',
                        textAlign: 'center',
                        isTextAlignFromAttr: true,
                        lineHeight: '2',
                        whiteSpace: 'pre',
                        direction: 'rtl',
                    },
                },
            ],
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });
});
