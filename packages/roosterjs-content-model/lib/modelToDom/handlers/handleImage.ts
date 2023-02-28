import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';

/**
 * @internal
 */
export const handleImage: ContentModelHandler<ContentModelImage> = (
    doc: Document,
    parent: Node,
    imageModel: ContentModelImage,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const img = doc.createElement('img');
    const element = document.createElement('span');

    parent.insertBefore(element, refNode);
    element.appendChild(img);

    img.src = imageModel.src;

    if (imageModel.alt) {
        img.alt = imageModel.alt;
    }

    if (imageModel.title) {
        img.title = imageModel.title;
    }

    applyFormat(img, context.formatAppliers.image, imageModel.format, context);
    applyFormat(img, context.formatAppliers.dataset, imageModel.dataset, context);

    applyFormat(element, context.formatAppliers.segment, imageModel.format, context);

    const { width, height } = imageModel.format;
    const widthNum = width ? parseValueWithUnit(width) : 0;
    const heightNum = height ? parseValueWithUnit(height) : 0;

    if (widthNum > 0) {
        img.width = widthNum;
    }

    if (heightNum > 0) {
        img.height = heightNum;
    }

    context.modelHandlers.segmentDecorator(doc, img, imageModel, context, null);

    context.regularSelection.current.segment = img;

    if (imageModel.isSelectedAsImageSelection) {
        context.imageSelection = {
            image: img,
        };
    }
};
