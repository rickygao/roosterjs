import { ContentModelDatasetBase } from '../../publicTypes/format/dataset/ContentModelDatasetBase';
import { getObjectKeys } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export function applyDataset<T extends ContentModelDatasetBase>(model: T, element: HTMLElement) {
    getObjectKeys(model.dataset).forEach(key => {
        element.dataset[key] = model.dataset[key];
    });
}
