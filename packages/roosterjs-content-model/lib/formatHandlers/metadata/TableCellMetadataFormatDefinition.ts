import { createBooleanDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const TableCellMetadataFormatDefinition = createObjectDefinition<TableCellMetadataFormat>(
    {
        bgColorOverride: createBooleanDefinition(true /** isOptional */),
    },
    false /* isOptional */,
    true /** allowNull */
);
