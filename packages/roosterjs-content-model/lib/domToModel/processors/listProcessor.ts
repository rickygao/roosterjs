import { ContentModelDatasetBase } from 'roosterjs-content-model/lib/publicTypes/format/ContentModelDatasetBase';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { ListMetadataFormat } from 'roosterjs-content-model/lib/publicTypes/format/formatParts/ListMetadataFormat';
import { parseDataset } from '../utils/parseDataset';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import {
    ListStyleMetadataFormatDefinition,
    OrderedMap,
    UnorderedMap,
} from 'roosterjs-content-model/lib/formatHandlers/metadata/ListStyleMetadataFormatDefinition';

/**
 * @internal
 */
export const listProcessor: ElementProcessor<HTMLOListElement | HTMLUListElement> = (
    group,
    element,
    context
) => {
    const level: ContentModelListItemLevelFormat = {};
    const { listFormat } = context;

    stackFormat(
        context,
        {
            segment: 'shallowClone',
        },
        () => {
            parseFormat(element, context.formatParsers.listLevel, level, context);
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

            parseListMetadata(element, level);

            const originalListParent = listFormat.listParent;

            listFormat.listParent = listFormat.listParent || group;
            listFormat.levels.push(level);

            try {
                context.elementProcessors.child(group, element, context);
            } finally {
                listFormat.levels.pop();
                listFormat.listParent = originalListParent;
            }
        }
    );
};

const OLTypeToStyleMap: Record<string, string> = {
    '1': 'decimal',
    a: 'lower-alpha',
    A: 'upper-alpha',
    i: 'lower-roman',
    I: 'upper-roman',
};

function parseListMetadata(
    element: HTMLOListElement | HTMLUListElement,
    format: ContentModelListItemLevelFormat
) {
    const tag = element.tagName;
    const listStyle =
        element.style.listStyleType || (tag == 'OL' && OLTypeToStyleMap[element.type]);
    const container: ContentModelDatasetBase<ListMetadataFormat> = {
        dataset: {},
    };

    parseDataset(element, container, ListStyleMetadataFormatDefinition);

    let { orderedStyleType, unorderedStyleType } = container.metadata || {};

    if (listStyle) {
        if (tag == 'OL' && orderedStyleType === undefined) {
            const value = getKeyFromValue(OrderedMap, listStyle);
            orderedStyleType = typeof value === 'undefined' ? undefined : parseInt(value);
        } else if (tag == 'UL' && unorderedStyleType === undefined) {
            const value = getKeyFromValue(UnorderedMap, listStyle);
            unorderedStyleType = typeof value === 'undefined' ? undefined : parseInt(value);
        }
    }

    format.orderedStyleType = orderedStyleType;
    format.unorderedStyleType = unorderedStyleType;
}

function getKeyFromValue<K extends string | number, V>(
    map: Record<K, V>,
    value: V | undefined
): string | undefined {
    const result =
        value === undefined ? undefined : getObjectKeys(map).filter(key => map[key] == value)[0];

    // During run time the key is always string
    return (result as any) as string | undefined;
}
