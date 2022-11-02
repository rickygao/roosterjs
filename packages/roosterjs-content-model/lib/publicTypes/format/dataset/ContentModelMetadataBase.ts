import { ContentModelDatasetBase } from './ContentModelDatasetBase';

export interface ContentModelMetadataBase<T> extends ContentModelDatasetBase {
    metadata?: T;
}
