import { ContentModelBlockBase } from '../ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';

/**
 * Content Model of Code
 */
export interface ContentModelCode
    extends ContentModelBlockGroupBase<'Code'>,
        ContentModelBlockBase<'BlockGroup'> {}
