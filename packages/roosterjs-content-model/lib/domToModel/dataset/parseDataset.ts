import { ContentModelDatasetBase } from '../../publicTypes/format/dataset/ContentModelDatasetBase';
import { getObjectKeys } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export type ParseDatasetCallback<T extends ContentModelDatasetBase> = (
    name: string,
    value: string | undefined,
    model: T
) => void;

/**
 * @internal
 */
export function parseDataset<T extends ContentModelDatasetBase>(
    model: T,
    element: HTMLElement,
    callbacks: Record<string, ParseDatasetCallback<T>> = {}
) {
    getObjectKeys<string>(element.dataset).forEach(key => {
        const callback = callbacks[key] || defaultCallback;

        callback(key, element.dataset[key], model);
    });
}

const defaultCallback: ParseDatasetCallback<ContentModelDatasetBase> = (name, value, model) => {
    if (typeof value !== 'undefined') {
        model.dataset[name] = value;
    }
};
