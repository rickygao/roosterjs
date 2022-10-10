import { applyFormat } from '../utils/applyFormat';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { handleBlock } from './handleBlock';
import { handleEntity } from './handleEntity';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';

/**
 * @internal
 */
export function handleSegment(
    doc: Document,
    parent: Node,
    segment: ContentModelSegment,
    context: ModelToDomContext
) {
    const regularSelection = context.regularSelection;

    // If start position is not set yet, and current segment is in selection, set start position
    if (segment.isSelected && !regularSelection.start) {
        regularSelection.start = {
            ...regularSelection.current,
        };
    }

    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case 'Image':
            element = doc.createElement('img');
            element.setAttribute('src', segment.src);
            regularSelection.current.segment = element;

            applyFormat(element, SegmentFormatHandlers, segment.format, context);
            break;
        case 'Text':
            const txt = doc.createTextNode(segment.text);

            if (segment.format.linkHref) {
                element = doc.createElement('a');
                element.setAttribute('href', segment.format.linkHref);
                if (segment.format.linkTarget) {
                    element.setAttribute('target', segment.format.linkTarget);
                }
            } else {
                element = doc.createElement('span');
            }
            element.appendChild(txt);
            regularSelection.current.segment = txt;

            applyFormat(element, SegmentFormatHandlers, segment.format, context);

            break;

        case 'Br':
            element = doc.createElement('br');
            regularSelection.current.segment = element;
            break;

        case 'General':
            handleBlock(doc, parent, segment, context);
            break;

        case 'Entity':
            handleEntity(doc, parent, segment, context);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }

    // If end position is not set, or it is not finalized, and current segment is still in selection, set end position
    // If there is other selection, we will overwrite regularSelection.end when we process that segment
    if (segment.isSelected && regularSelection.start) {
        regularSelection.end = {
            ...regularSelection.current,
        };
    }
}
