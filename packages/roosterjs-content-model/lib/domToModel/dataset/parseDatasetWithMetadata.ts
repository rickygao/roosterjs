import { ContentModelMetadataBase } from '../../publicTypes/format/dataset/ContentModelMetadataBase';
import { Definition } from 'roosterjs-editor-types';
import { parseDataset, ParseDatasetCallback } from './parseDataset';
import { validate } from 'roosterjs-editor-dom';

const MetadataDatasetName = 'editingInfo';

export function parseDatasetWithMetadata<
    MetadataType,
    ModelType extends ContentModelMetadataBase<MetadataType>
>(
    model: ModelType,
    element: HTMLElement,
    definition?: Definition<MetadataType>,
    callbacks: Record<string, ParseDatasetCallback<ModelType>> = {}
) {
    const metadataCallback: ParseDatasetCallback<ContentModelMetadataBase<MetadataType>> = (
        name,
        value,
        model
    ) => {
        try {
            const obj = JSON.parse(value);

            if (typeof obj != 'undefined' && (!definition || validate(obj, definition))) {
                model.metadata = obj;
            }
        } catch {}
    };

    callbacks = {
        ...callbacks,
        [MetadataDatasetName]: metadataCallback,
    };
    parseDataset(model, element, callbacks);
}
