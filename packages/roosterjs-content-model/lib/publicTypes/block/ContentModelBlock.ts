import { ContentModelCode } from './group/ContentModelCode';
import { ContentModelEntity } from '../entity/ContentModelEntity';
import { ContentModelGeneralBlock } from './group/ContentModelGeneralBlock';
import { ContentModelHeader } from './group/ContentModelHeader';
import { ContentModelListItem } from './group/ContentModelListItem';
import { ContentModelParagraph } from './ContentModelParagraph';
import { ContentModelQuote } from './group/ContentModelQuote';
import { ContentModelTable } from './ContentModelTable';

/**
 * A union type of Content Model Block
 */
export type ContentModelBlock =
    | ContentModelQuote
    | ContentModelCode
    | ContentModelHeader
    | ContentModelListItem
    | ContentModelGeneralBlock
    | ContentModelTable
    | ContentModelParagraph
    | ContentModelEntity;
