import { adjustSegmentSelectionForLink } from '../../modelApi/selection/adjustSegmentSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
import { HyperLinkColorPlaceholder } from '../../formatHandlers/utils/defaultStyles';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Remove link at selection. If no links at selection, do nothing.
 * If selection contains multiple links, all of the link styles will be removed.
 * If only part of a link is selected, the whole link style will be removed.
 * @param editor The editor instance
 */
export default function removeLink(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'removeLink', model => {
        adjustSegmentSelectionForLink(model);

        const segments = getSelectedSegments(model, false /*includingFormatHolder*/);

        segments.forEach(segment => {
            if (segment.format.textColor == HyperLinkColorPlaceholder) {
                delete segment.format.textColor;
            }

            segment.format.underline = false;
            delete segment.link;
        });

        return segments.length > 0;
    });
}
