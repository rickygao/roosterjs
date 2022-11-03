import { ContentModelDatasetBase } from '../../publicTypes/format/ContentModelDatasetBase';
import { Definition } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { validate } from 'roosterjs-editor-dom';

const MetadataDatasetName = 'editingInfo';

export function parseDataset<MetadataType, ModelType extends ContentModelDatasetBase<MetadataType>>(
    element: HTMLElement,
    model: ModelType,
    metadataDefinition?: Definition<MetadataType>
) {
    getObjectKeys<string>(element.dataset).forEach(key => {
        const value = element.dataset[key];

        if (typeof value !== 'undefined') {
            if (key == MetadataDatasetName) {
                try {
                    const obj = JSON.parse(value);

                    if (
                        typeof obj != 'undefined' &&
                        (!metadataDefinition || validate(obj, metadataDefinition))
                    ) {
                        model.metadata = obj;
                    }
                } catch {}
            } else {
                model.dataset[key] = value;
            }
        }
    });
}
