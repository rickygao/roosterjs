import { ContentModelDatasetBase } from '../../publicTypes/format/ContentModelDatasetBase';
import { Definition } from 'roosterjs-editor-types/lib';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { setMetadata } from 'roosterjs-editor-dom/lib';

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

    setMetadata(element, model.metadata, definition);
}
