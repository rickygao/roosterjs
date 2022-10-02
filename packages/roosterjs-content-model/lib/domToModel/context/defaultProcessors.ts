import { brProcessor } from '../processors/brProcessor';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { imageProcessor } from '../processors/imageProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { listItemProcessor } from '../processors/listItemProcessor';
import { listProcessor } from '../processors/listProcessor';
import { quoteProcessor } from '../processors/quoteProcessor';
import { tableProcessor } from '../processors/tableProcessor';

/**
 * @internal
 */
export const defaultProcessorMap: Record<string, ElementProcessor> = {
    A: knownElementProcessor,
    ADDRESS: knownElementProcessor,
    ARTICLE: knownElementProcessor,
    ASIDE: knownElementProcessor,
    B: knownElementProcessor,
    BODY: knownElementProcessor, // TODO
    BLOCKQUOTE: quoteProcessor,
    BR: brProcessor,
    CENTER: knownElementProcessor,
    CODE: knownElementProcessor, // TODO
    DIV: knownElementProcessor,
    DD: knownElementProcessor, // TODO
    DL: knownElementProcessor, // TODO
    DT: knownElementProcessor, // TODO
    EM: knownElementProcessor,
    FONT: fontProcessor,
    FIELDSET: knownElementProcessor, // TODO
    FIGURE: knownElementProcessor, // TODO
    FIGCAPTION: knownElementProcessor, // TODO
    FOOTER: knownElementProcessor, // TODO
    FORM: knownElementProcessor, // TODO
    I: knownElementProcessor,
    IMG: imageProcessor,
    H1: knownElementProcessor, // TODO
    H2: knownElementProcessor, // TODO
    H3: knownElementProcessor, // TODO
    H4: knownElementProcessor, // TODO
    H5: knownElementProcessor, // TODO
    H6: knownElementProcessor, // TODO
    HEADER: knownElementProcessor, // TODO
    HR: knownElementProcessor, // TODO
    LI: listItemProcessor, // TODO
    MAIN: knownElementProcessor, // TODO
    NAV: knownElementProcessor, // TODO
    OL: listProcessor,
    P: knownElementProcessor,
    PRE: knownElementProcessor,
    S: knownElementProcessor,
    SECTION: knownElementProcessor,
    SPAN: knownElementProcessor,
    STRIKE: knownElementProcessor,
    STRONG: knownElementProcessor,
    SUB: knownElementProcessor,
    SUP: knownElementProcessor,
    TABLE: tableProcessor,
    TD: knownElementProcessor, // TODO
    TBODY: knownElementProcessor, // TODO
    TFOOT: knownElementProcessor, // TODO
    TH: knownElementProcessor, // TODO
    U: knownElementProcessor,
    UL: listProcessor, // TODO
    VIDEO: knownElementProcessor, // TODO
};
