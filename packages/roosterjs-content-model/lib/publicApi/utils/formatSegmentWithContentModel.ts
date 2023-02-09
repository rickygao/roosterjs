import { adjustWordSelection } from '../../modelApi/selection/adjustWordSelection';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { DomToModelOption, IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { formatWithContentModel } from './formatWithContentModel';
import { getPendingFormat, setPendingFormat } from '../format/pendingFormat';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
/**
 * @internal
 */
export function formatSegmentWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    toggleStyleCallback: (
        format: ContentModelSegmentFormat,
        isTuringOn: boolean,
        segment: ContentModelSegment | null
    ) => void,
    segmentHasStyleCallback?: (
        format: ContentModelSegmentFormat,
        segment: ContentModelSegment | null
    ) => boolean,
    includingFormatHolder?: boolean,
    domToModelOptions?: DomToModelOption
) {
    formatWithContentModel(
        editor,
        apiName,
        model => {
            let segments = getSelectedSegments(model, !!includingFormatHolder);
            const pendingFormat = getPendingFormat(editor);
            let isCollapsedSelection =
                segments.length == 1 && segments[0].segmentType == 'SelectionMarker';

            if (isCollapsedSelection) {
                segments = adjustWordSelection(model, segments[0]);
                if (segments.length > 1) {
                    isCollapsedSelection = false;
                }
            }

            const formatsAndSegments: [
                ContentModelSegmentFormat,
                ContentModelSegment | null
            ][] = pendingFormat
                ? [[pendingFormat, null]]
                : segments.map(segment => [segment.format, segment]);

            const isTurningOff = segmentHasStyleCallback
                ? formatsAndSegments.every(([format, segment]) =>
                      segmentHasStyleCallback(format, segment)
                  )
                : false;

            if (!pendingFormat) {
                // If selection also has link, put link into the list as well so we can format the link.
                // Do this after we check "isTurningOff" so that link format won't impact this check result
                segments.forEach(segment => {
                    if (segment.link) {
                        formatsAndSegments.push([segment.link.format, null]);
                    }
                });
            }

            formatsAndSegments.forEach(([format, segment]) =>
                toggleStyleCallback(format, !isTurningOff, segment)
            );

            if (!pendingFormat && isCollapsedSelection) {
                setPendingFormat(editor, segments[0].format);
            }

            if (isCollapsedSelection) {
                editor.focus();
                return false;
            } else {
                return formatsAndSegments.length > 0;
            }
        },
        domToModelOptions
    );
}
