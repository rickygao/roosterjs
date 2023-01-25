import { getColor, setColor } from '../../../lib/formatHandlers/utils/color';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';

describe('getColor', () => {
    let div: HTMLElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(
        expectedLightTextColor: string | undefined,
        expectedLightBackColor: string | undefined,
        expectedDarkTextColor: string | undefined,
        expectedDarkBackColor: string | undefined
    ) {
        const lightTextColor = getColor(div, false, null, false);
        const lightBackColor = getColor(div, true, null, false);
        const darkTextColor = getColor(div, false, null, true);
        const darkBackColor = getColor(div, true, null, true);

        expect(lightTextColor).toBe(expectedLightTextColor);
        expect(lightBackColor).toBe(expectedLightBackColor);
        expect(darkTextColor).toBe(expectedDarkTextColor);
        expect(darkBackColor).toBe(expectedDarkBackColor);
    }

    it('no color', () => {
        runTest(undefined, undefined, undefined, undefined);
    });

    it('has CSS color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has CSS color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has original CSS color', () => {
        div.dataset.ogsc = 'red';
        div.dataset.ogsb = 'blue';
        runTest(undefined, undefined, 'red', 'blue');
    });

    it('has attr color', () => {
        div.setAttribute('color', 'red');
        div.setAttribute('bgcolor', 'blue');
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has original attr color', () => {
        div.dataset.ogac = 'red';
        div.dataset.ogab = 'blue';
        runTest(undefined, undefined, 'red', 'blue');
    });

    it('has both color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        div.setAttribute('color', 'green');
        div.setAttribute('bgcolor', 'yellow');
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has both color and original color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        div.setAttribute('color', 'green');
        div.setAttribute('bgcolor', 'yellow');
        div.dataset.ogsc = '#aaa';
        div.dataset.ogsb = '#bbb';
        div.dataset.ogac = '#ccc';
        div.dataset.ogab = '#ddd';
        runTest('red', 'blue', '#aaa', '#bbb');
    });
});

describe('setColor', () => {
    function getDarkColor(color: string) {
        // just a fake color
        return `var(--${color})`;
    }

    function runTest(
        textColor: string,
        backColor: string,
        expectedLightHtml: string,
        expectedDarkHtml: string
    ) {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, textColor, false, null, false, getDarkColor);
        setColor(lightDiv, backColor, true, null, false, getDarkColor);
        setColor(darkDiv, textColor, false, null, true, getDarkColor);
        setColor(darkDiv, backColor, true, null, true, getDarkColor);

        expect(lightDiv.outerHTML).toBe(expectedLightHtml);
        expect(darkDiv.outerHTML).toBe(expectedDarkHtml);
    }

    it('no color', () => {
        runTest('', '', '<div></div>', '<div></div>');
    });

    itChromeOnly('has color', () => {
        runTest(
            'red',
            'blue',
            '<div style="color: red; background-color: blue;"></div>',
            '<div data-ogsc="red" data-ogsb="blue" style="color: var(--red); background-color: var(--blue);"></div>'
        );
    });
});
