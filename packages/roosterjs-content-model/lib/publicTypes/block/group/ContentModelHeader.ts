import { ContentModelBlockBase } from '../ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';

/**
 * Content Model of Header
 */
export interface ContentModelHeader
    extends ContentModelBlockGroupBase<'Header'>,
        ContentModelBlockBase<'BlockGroup'> {
    /**
     * Level of this header, from 1 to 6
     */
    headerLevel: number;
}
