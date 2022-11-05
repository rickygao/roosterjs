import { ContentModelDatasetBase } from '../../publicTypes/format/ContentModelDatasetBase';
import { Definition } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { setMetadata } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export function applyDataset<MetadataType, ModelType extends ContentModelDatasetBase<MetadataType>>(
    element: HTMLElement,
    model: ModelType,
    definition?: Definition<MetadataType>
) {
    getObjectKeys<string>(model.dataset).forEach(key => {
        element.dataset[key] = model.dataset[key];
    });

    if (model.metadata) {
        setMetadata(element, model.metadata, definition);
    }
}
