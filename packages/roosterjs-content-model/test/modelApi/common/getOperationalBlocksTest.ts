import * as getSelections from '../../../lib/modelApi/selection/getSelections';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';

import {
    getOperationalBlocks,
    OperationalBlocks,
} from '../../../lib/modelApi/common/getOperationalBlocks';

describe('getOperationalBlocks', () => {
    it('empty input', () => {
        const result = getOperationalBlocks(createContentModelDocument(), ['ListItem'], []);

        expect(result).toEqual([]);
    });

    function runTest(
        selections: getSelections.ContentModelSelectionInfo[],
        blockGroupTypes: ContentModelBlockGroupType[],
        stopTypes: ContentModelBlockGroupType[],
        deepFirst: boolean,
        expectedResult: OperationalBlocks<ContentModelBlockGroup>[]
    ) {
        spyOn(getSelections, 'getSelections').and.returnValue(selections);

        const result = getOperationalBlocks(null!, blockGroupTypes, stopTypes, deepFirst);

        expect(result).toEqual(expectedResult);
    }

    it('selected paragraph without expect group type', () => {
        const group = createContentModelDocument();
        const para = createParagraph();

        runTest(
            [
                {
                    path: [group],
                    block: para,
                },
            ],
            ['ListItem'],
            ['TableCell'],
            false,
            [{ block: para, parent: group }]
        );
    });

    it('selected paragraph with expect group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);

        runTest(
            [
                { block: para1, path: [listItem, group] },
                { block: para2, path: [group] },
            ],
            ['ListItem'],
            ['TableCell'],
            false,
            [
                {
                    block: listItem,
                    parent: group,
                },
                {
                    block: para2,
                    parent: group,
                },
            ]
        );
    });

    it('selected multiple paragraphs in same expect group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listItem = createListItem([]);

        runTest(
            [
                { block: para1, path: [listItem, group] },
                { block: para2, path: [listItem, group] },
                { block: para3, path: [group] },
            ],
            ['ListItem'],
            ['TableCell'],
            false,
            [
                { block: listItem, parent: group },
                { block: para3, parent: group },
            ]
        );
    });

    it('selected paragraph with stop type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem1 = createListItem([]);
        const listItem2 = createListItem([]);
        const quote = createQuote();

        runTest(
            [
                { block: para1, path: [listItem1, group] },
                { block: para2, path: [quote, listItem2, group] },
            ],
            ['ListItem'],
            ['Quote'],
            false,
            [
                { block: listItem1, parent: group },
                { block: para2, parent: quote },
            ]
        );
    });

    it('selected paragraph with multiple group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);
        const quote = createQuote();

        runTest(
            [
                { block: para1, path: [listItem, group] },
                { block: para2, path: [quote, group] },
            ],
            ['ListItem', 'Quote'],
            ['TableCell'],
            false,
            [
                {
                    block: listItem,
                    parent: group,
                },
                { block: quote, parent: group },
            ]
        );
    });

    it('multiple group type, width first', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { backgroundColor: 'red' });
        const para2 = createParagraph(false, { backgroundColor: 'green' });
        const listItem = createListItem([]);
        const quote1 = createQuote({ backgroundColor: 'blue' });
        const quote2 = createQuote({ backgroundColor: 'black' });

        runTest(
            [
                { block: para1, path: [quote1, listItem, group] },
                { block: para2, path: [quote2, group] },
            ],
            ['ListItem', 'Quote'],
            ['TableCell'],
            false,
            [
                { block: quote1, parent: listItem },
                { block: quote2, parent: group },
            ]
        );
    });

    it('multiple group type, deep first', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { backgroundColor: 'red' });
        const para2 = createParagraph(false, { backgroundColor: 'green' });
        const listItem = createListItem([]);
        const quote1 = createQuote({ backgroundColor: 'blue' });
        const quote2 = createQuote({ backgroundColor: 'black' });

        runTest(
            [
                { block: para1, path: [quote1, listItem, group] },
                { block: para2, path: [quote2, group] },
            ],
            ['ListItem', 'Quote'],
            ['TableCell'],
            true,
            [
                { block: listItem, parent: group },
                { block: quote2, parent: group },
            ]
        );
    });
});
