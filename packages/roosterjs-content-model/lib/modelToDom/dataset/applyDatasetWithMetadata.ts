import { applyDataset } from './applyDataset';
import { ContentModelMetadataBase } from '../../publicTypes/format/dataset/ContentModelMetadataBase';
import { Definition } from 'roosterjs-editor-types/lib';
import { setMetadata } from 'roosterjs-editor-dom/lib';

/**
 * @internal
 */
export function applyDatasetWithMetadata<
    MetadataType,
    ModelType extends ContentModelMetadataBase<MetadataType>
>(model: ModelType, element: HTMLElement, definition?: Definition<MetadataType>) {
    applyDataset(model, element);

    setMetadata(element, model.metadata, definition);
}
