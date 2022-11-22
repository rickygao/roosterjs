import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { BorderFormatRenderers } from '../format/formatPart/BorderFormatRenderers';
import { ContentModelView } from '../ContentModelView';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { SizeFormatRenderers } from '../format/formatPart/SizeFormatRenderers';
import {
    ContentModelBlockGroupFormat,
    ContentModelFormatContainer,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelFormatContainerView.scss');

const renderers: FormatRenderer<ContentModelBlockGroupFormat>[] = [
    MarginFormatRenderer,
    PaddingFormatRenderer,
    ...BorderFormatRenderers,
    ...SizeFormatRenderers,
];

export function ContentModelFormatContainerView(props: {
    formatContainer: ContentModelFormatContainer;
}) {
    const { formatContainer } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={formatContainer} />;
    }, [formatContainer]);
    const getFormat = React.useCallback(() => {
        return <FormatView format={formatContainer.format} renderers={renderers} />;
    }, [formatContainer.format]);

    return (
        <ContentModelView
            title="FormatContainer"
            className={styles.modelFormatContainer}
            hasSelection={hasSelectionInBlock(formatContainer)}
            jsonSource={formatContainer}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
