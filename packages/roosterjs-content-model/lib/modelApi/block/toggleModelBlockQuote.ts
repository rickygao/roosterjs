import { addBlock } from '../common/addBlock';
import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { ContentModelQuoteFormat } from '../../publicTypes/format/ContentModelQuoteFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelSelection, getSelections } from '../selection/getSelections';
import { createQuote } from '../creators/createQuote';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

const BuildInQuoteFormat: ContentModelQuoteFormat = {
    marginTop: '1em',
    marginBottom: '1em',
    marginLeft: '40px',
    marginRight: '40px',
    paddingLeft: '10px',
};

interface QuoteItemToMerge {
    parent: ContentModelBlockGroup;
    firstQuote: ContentModelQuote;
}

/**
 * @internal
 */
export function toggleModelBlockQuote(
    model: ContentModelDocument,
    quoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): boolean {
    const selections = getSelections(model);
    const paragraphOfQuote = getOperationalBlocks<ContentModelQuote | ContentModelListItem>(
        selections,
        ['Quote', 'ListItem'],
        ['TableCell'],
        true /*deepFirst*/
    );
    const areAllQuotes = paragraphOfQuote.every(item =>
        isBlockGroupOfType<ContentModelQuote>(item, 'Quote')
    );
    const fullQuoteFormat = {
        ...BuildInQuoteFormat,
        ...quoteFormat,
    };
    const potentialMergeQuotes: QuoteItemToMerge[] = [];

    paragraphOfQuote.forEach(item => {
        let quoteItemToMerge: QuoteItemToMerge | undefined;
        if (isBlockGroupOfType<ContentModelQuote>(item, 'Quote')) {
            if (areAllQuotes) {
                const parentGroup = findParentGroup(item, selections);
                const index = parentGroup?.blocks.indexOf(item) ?? -1;

                if (index >= 0) {
                    item.blocks.forEach(block => {
                        setParagraphNotImplicit(block);
                    });

                    parentGroup?.blocks.splice(index, 1, ...item.blocks);
                }
            }
        } else if (isBlockGroupOfType<ContentModelListItem>(item, 'ListItem')) {
            const parentGroup = findParentGroup(item, selections);

            if (parentGroup) {
                quoteItemToMerge = wrapBlock(parentGroup, item, fullQuoteFormat, segmentFormat);
            }
        } else if (item.paragraph) {
            quoteItemToMerge = wrapBlock(
                item.path[0],
                item.paragraph,
                fullQuoteFormat,
                segmentFormat
            );
        }

        if (quoteItemToMerge) {
            // Use reverse order, so that we can merge from last to first to avoid modifying unmerged quotes
            potentialMergeQuotes.unshift(quoteItemToMerge);
        }
    });

    potentialMergeQuotes.forEach(({ parent, firstQuote }) => {
        const index = parent.blocks.indexOf(firstQuote);
        const nextBlock = parent.blocks[index + 1];

        if (
            index >= 0 &&
            canMergeQuote(nextBlock, firstQuote.format, firstQuote.quoteSegmentFormat)
        ) {
            arrayPush(firstQuote.blocks, nextBlock.blocks);
            parent.blocks.splice(index + 1, 1);
        }
    });

    return paragraphOfQuote.length > 0;
}

function wrapBlock(
    parentGroup: ContentModelBlockGroup,
    currentBlock: ContentModelBlock,
    fullQuoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): { parent: ContentModelBlockGroup; firstQuote: ContentModelQuote } {
    const index = parentGroup.blocks.indexOf(currentBlock);

    parentGroup.blocks.splice(index, 1);

    const prevBlock = parentGroup.blocks[index - 1];
    const quote = canMergeQuote(prevBlock, fullQuoteFormat, segmentFormat)
        ? prevBlock
        : createAndAddQuote(parentGroup, index, fullQuoteFormat, segmentFormat);

    setParagraphNotImplicit(currentBlock);

    addBlock(quote, currentBlock);

    return {
        parent: parentGroup,
        firstQuote: quote,
    };
}

function setParagraphNotImplicit(block: ContentModelBlock) {
    if (block.blockType == 'Paragraph' && block.isImplicit) {
        block.isImplicit = false;
    }
}

function canMergeQuote(
    target: ContentModelBlock | undefined,
    quoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): target is ContentModelQuote {
    return (
        isBlockGroupOfType<ContentModelQuote>(target, 'Quote') &&
        areSameFormats(quoteFormat, target.format) &&
        areSameFormats(segmentFormat, target.quoteSegmentFormat)
    );
}

function createAndAddQuote(
    parent: ContentModelBlockGroup,
    index: number,
    quoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): ContentModelQuote {
    const quote = createQuote(quoteFormat, segmentFormat);
    parent.blocks.splice(index, 0, quote);
    return quote;
}

function findParentGroup<T extends ContentModelBlockGroup>(
    group: T,
    selections: ContentModelSelection[]
): ContentModelBlockGroup | null {
    for (let i = 0; i < selections.length; i++) {
        const index = selections[i].path.indexOf(group);

        if (index >= 0) {
            return selections[i].path[index + 1] || null;
        }
    }

    return null;
}
