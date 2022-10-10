import * as React from 'react';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { ContentModelSegmentView } from './ContentModelSegmentView';
import { ContentModelView } from '../ContentModelView';
import { DirectionFormatRenderer } from '../format/formatPart/DirectionFormat';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { IndentationFormatRenderer } from '../format/formatPart/IndentationFormatRenderer';
import { LineHeightFormatRenderer } from '../format/formatPart/LineHeightFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { TextAlignFormatRenderer } from '../format/formatPart/TextAlignFormatRenderer';
import { useProperty } from '../../hooks/useProperty';
import { WhiteSpaceFormatRenderer } from '../format/formatPart/WhiteSpaceFormatRenderer';
import {
    ContentModelParagraph,
    ContentModelBlockFormat,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelParagraphView.scss');

const ParagraphFormatRenders: FormatRenderer<ContentModelBlockFormat>[] = [
    BackgroundColorFormatRenderer,
    DirectionFormatRenderer,
    TextAlignFormatRenderer,
    MarginFormatRenderer,
    IndentationFormatRenderer,
    LineHeightFormatRenderer,
    WhiteSpaceFormatRenderer,
];

export function ContentModelParagraphView(props: { paragraph: ContentModelParagraph }) {
    const { paragraph } = props;
    const implicitCheckbox = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = useProperty(!!paragraph.isImplicit);

    const onChange = React.useCallback(() => {
        const newValue = implicitCheckbox.current.checked;
        paragraph.isImplicit = newValue;
        setValue(newValue);
    }, [paragraph, setValue]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    <input
                        type="checkbox"
                        checked={value}
                        ref={implicitCheckbox}
                        onChange={onChange}
                    />
                    Implicit
                </div>
                {paragraph.segments.map((segment, index) => (
                    <ContentModelSegmentView segment={segment} key={index} />
                ))}
            </>
        );
    }, [paragraph, value]);

    const getFormat = React.useCallback(() => {
        return <FormatView format={paragraph.format} renderers={ParagraphFormatRenders} />;
    }, [paragraph.format]);

    return (
        <ContentModelView
            title="Paragraph"
            subTitle={paragraph.isImplicit ? ' (Implicit)' : ''}
            isExpanded={true}
            className={styles.modelParagraph}
            hasSelection={hasSelectionInBlock(paragraph)}
            jsonSource={paragraph}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
