import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
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
    formatWithContentModel(
        editor,
        apiName,
        model => {
            const segments = getSelectedSegments(model, includingFormatHolder);

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

function getSelectedSegments(
    model: ContentModelDocument,
    includingFormatHolder?: boolean
): ContentModelSegment[] {
    const result: ContentModelSegment[] = [];

    getSelections(model, {
        includeListFormatHolder: includingFormatHolder,
    }).forEach(({ segments, block }) => {
        if (segments && (includingFormatHolder || block?.blockType == 'Paragraph')) {
            arrayPush(result, segments);
        }
    });

    return result;
}
