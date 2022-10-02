import * as React from 'react';
import { ContentModelBlockGroup } from 'roosterjs-content-model';
import { ContentModelDocumentView } from './ContentModelDocumentView';
import { ContentModelGeneralView } from './ContentModelGeneralView';
import { ContentModelListItemView } from './ContentModelListItemView';
import { ContentModelQuoteView } from './ContentModelQuoteView';
import { ContentModelTableCellView } from './ContentModelTableCellView';

export function ContentModelBlockGroupView(props: { group: ContentModelBlockGroup }) {
    const { group } = props;

    switch (group.blockGroupType) {
        case 'Code':
            return null;

        case 'Document':
            return <ContentModelDocumentView doc={group} />;

        case 'General':
            return <ContentModelGeneralView model={group} />;

        case 'Header':
            return null;

        case 'ListItem':
            return <ContentModelListItemView listItem={group} />;

        case 'Quote':
            return <ContentModelQuoteView quote={group} />;

        case 'TableCell':
            return <ContentModelTableCellView cell={group} />;
    }
}
