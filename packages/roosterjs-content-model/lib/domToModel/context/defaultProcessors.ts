import { brProcessor } from '../processors/brProcessor';
import { childProcessor } from '../processors/childProcessor';
import { createTempContainerProcessor } from '../processors/tempContainerProcessor';
import { elementProcessor } from '../processors/elementProcessor';
import { ElementProcessorMap } from '../../publicTypes/context/DomToModelSettings';
import { entityProcessor } from '../processors/entityProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { generalProcessor } from '../processors/generalProcessor';
import { imageProcessor } from '../processors/imageProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { listItemProcessor } from '../processors/listItemProcessor';
import { listProcessor } from '../processors/listProcessor';
import { quoteProcessor } from '../processors/quoteProcessor';
import { tableProcessor } from '../processors/tableProcessor';
import { textProcessor } from '../processors/textProcessor';

const tempContainerProcessor = createTempContainerProcessor();

/**
 * @internal
 */
export const defaultProcessorMap: ElementProcessorMap = {
    a: knownElementProcessor,
    address: knownElementProcessor,
    article: knownElementProcessor,
    aside: knownElementProcessor,
    b: knownElementProcessor,
    blockquote: quoteProcessor,
    br: brProcessor,
    code: knownElementProcessor, // TODO
    div: tempContainerProcessor,
    dd: knownElementProcessor, // TODO
    dl: knownElementProcessor, // TODO
    dt: knownElementProcessor, // TODO
    em: knownElementProcessor,
    font: fontProcessor,
    fieldset: knownElementProcessor, // TODO
    figure: knownElementProcessor, // TODO
    figcaption: knownElementProcessor, // TODO
    footer: knownElementProcessor, // TODO
    form: knownElementProcessor, // TODO
    i: knownElementProcessor,
    img: imageProcessor,
    h1: knownElementProcessor, // TODO
    h2: knownElementProcessor, // TODO
    h3: knownElementProcessor, // TODO
    h4: knownElementProcessor, // TODO
    h5: knownElementProcessor, // TODO
    h6: knownElementProcessor, // TODO
    header: knownElementProcessor, // TODO
    hr: knownElementProcessor, // TODO
    li: listItemProcessor,
    main: knownElementProcessor, // TODO
    nav: knownElementProcessor, // TODO
    ol: listProcessor,
    p: knownElementProcessor,
    pre: knownElementProcessor,
    s: knownElementProcessor,
    section: knownElementProcessor,
    span: tempContainerProcessor,
    strike: knownElementProcessor,
    strong: knownElementProcessor,
    sub: knownElementProcessor,
    sup: knownElementProcessor,
    table: tableProcessor,
    tbody: knownElementProcessor, // TODO
    tfoot: knownElementProcessor, // TODO
    th: knownElementProcessor, // TODO
    u: knownElementProcessor,
    ul: listProcessor,
    video: knownElementProcessor, // TODO

    '*': generalProcessor,
    '#text': textProcessor,
    element: elementProcessor,
    entity: entityProcessor,
    child: childProcessor,
};
