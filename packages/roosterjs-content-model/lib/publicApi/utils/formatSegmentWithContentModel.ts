import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelections } from '../../modelApi/selection/getSelections';
import {
    DomToModelOption,
    IExperimentalContentModelEditor,
} from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 */
export function formatSegmentWithContentModel(
    editor: IExperimentalContentModelEditor,
    apiName: string,
    toggleStyleCallback: (segment: ContentModelSegment, isTuringOn: boolean) => void,
    segmentHasStyleCallback?: (segment: ContentModelSegment) => boolean,
    includingFormatHolder?: boolean,
    domToModelOptions?: DomToModelOption
) {
    const segments: ContentModelSegment[] = [];

    formatWithContentModel(
        editor,
        apiName,
        model => {
            const selections = getSelections(model, {
                includeListFormatHolder: includingFormatHolder,
            });

            selections.forEach(selection => {
                switch (selection.type) {
                    case 'Segments':
                        arrayPush(segments, selection.segments);
                        break;

                    case 'ListNumber':
                        segments.push(selection.formatHolder);
                        break;

                    case 'Marker':
                        segments.push(selection.marker);
                        break;
                }
            });

            const isTurningOff = segmentHasStyleCallback
                ? segments.every(segmentHasStyleCallback)
                : false;

            segments.forEach(segment => toggleStyleCallback(segment, !isTurningOff));

            return (
                segments.length > 1 ||
                (!!segments[0] && segments[0].segmentType != 'SelectionMarker')
            );
        },
        domToModelOptions
    );
}
