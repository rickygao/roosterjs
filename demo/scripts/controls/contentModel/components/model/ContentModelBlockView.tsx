import * as React from 'react';
import { ContentModelBlock } from 'roosterjs-content-model';
import { ContentModelBlockGroupView } from './ContentModelBlockGroupView';
import { ContentModelParagraphView } from './ContentModelParagraphView';
import { ContentModelTableView } from './ContentModelTableView';

export function ContentModelBlockView(props: { block: ContentModelBlock }) {
    const { block } = props;

    switch (block.blockType) {
        case 'BlockGroup':
            return <ContentModelBlockGroupView group={block} />;

        case 'Entity':
            return null;

        case 'Paragraph':
            return <ContentModelParagraphView paragraph={block} />;

        case 'Table':
            return <ContentModelTableView table={block} />;
    }
}
