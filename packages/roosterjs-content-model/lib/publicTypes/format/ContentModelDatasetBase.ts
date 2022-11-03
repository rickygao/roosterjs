/**
 * Base interface of a model that support dataset from HTML element
 */
export interface ContentModelDatasetBase<MetadataType = undefined> {
    /**
     * The dataset object
     */
    dataset: Record<string, string>;

    /**
     * Metadata of this model if any
     */
    metadata?: MetadataType;
}
