import { ContentModelEntity } from '../entity/ContentModelEntity';
import { ContentModelFormatContainer } from '../group/ContentModelFormatContainer';
import { ContentModelGeneralBlock } from '../group/ContentModelGeneralBlock';
import { ContentModelHR } from './ContentModelHR';
import { ContentModelListItem } from '../group/ContentModelListItem';
import { ContentModelParagraph } from './ContentModelParagraph';
import { ContentModelTable } from './ContentModelTable';

/**
 * A union type of Content Model Block
 */
export type ContentModelBlock =
    | ContentModelFormatContainer
    | ContentModelListItem
    | ContentModelGeneralBlock
    | ContentModelTable
    | ContentModelParagraph
    | ContentModelEntity
    | ContentModelHR;
