import createEditorCore from './createMockEditorCore';
import { getStyleBasedFormatState } from '../../lib/coreApi/getStyleBasedFormatState';

describe('getStyleBasedFormatState', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('light mode', () => {
        const core = createEditorCore(div, {});
        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><div id="div1">test</div></div>';
        const node = document.getElementById('div1');
        const style = getStyleBasedFormatState(core, node);
        expect(style.fontName).toBe('arial');
        expect(style.fontSize).toBe('12pt');
        expect(style.textColor).toBe('black');
        expect(style.backgroundColor).toBe('white');
        expect(style.textColors).toBeUndefined();
        expect(style.backgroundColors).toBeUndefined();
    });

    it('dark mode, no color node', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><div id="div1">test</div></div>';
        const node = document.getElementById('div1');
        const style = getStyleBasedFormatState(core, node);
        expect(style.fontName).toBe('arial');
        expect(style.fontSize).toBe('12pt');
        expect(style.textColor).toBe('black');
        expect(style.backgroundColor).toBe('white');
        expect(style.textColors).toBeUndefined();
        expect(style.backgroundColors).toBeUndefined();
    });
});
