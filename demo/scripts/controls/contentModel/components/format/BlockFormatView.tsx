import * as React from 'react';
import { BackgroundColorFormatRenderer } from './formatPart/BackgroundColorFormatRenderer';
import { ContentModelBlockFormat, ContentModelSegmentFormat } from 'roosterjs-content-model';
import { DirectionFormatRenderers } from './formatPart/DirectionFormatRenderers';
import { FormatRenderer } from './utils/FormatRenderer';
import { FormatView } from './FormatView';
import { IndentationFormatRenderer } from './formatPart/IndentationFormatRenderer';
import { LineHeightFormatRenderer } from './formatPart/LineHeightFormatRenderer';
import { MarginFormatRenderer } from './formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from './formatPart/PaddingFormatRenderer';
import { SizeFormatRenderers } from './formatPart/SizeFormatRenderers';
import { WhiteSpaceFormatRenderer } from './formatPart/WhiteSpaceFormatRenderer';

const BlockFormatRenders: FormatRenderer<ContentModelBlockFormat>[] = [
    BackgroundColorFormatRenderer,
    ...DirectionFormatRenderers,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    ...SizeFormatRenderers,
    IndentationFormatRenderer,
    LineHeightFormatRenderer,
    WhiteSpaceFormatRenderer,
];

export function BlockFormatView(props: { format: ContentModelSegmentFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={BlockFormatRenders} />;
}
