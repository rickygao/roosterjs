import { ContentModelBlock } from '../block/ContentModelBlock';
import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { ContentModelLink } from '../decorator/ContentModelLink';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ModelToDomContext } from './ModelToDomContext';

/**
 * Type of Content Model to DOM handler
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param refNode Reference node. This is the next node the new node to be inserted.
 * It is used when write DOM tree onto existing DOM true. If there is no reference node, pass null.
 */
export type ContentModelHandler<
    T extends ContentModelSegment | ContentModelBlock | ContentModelBlockGroup | ContentModelLink
> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    refNode: Node | null
) => void;
