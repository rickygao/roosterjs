import { ColorKeyAndValue, DarkColorHandler, ModeIndependentColor } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';

const VARIABLE_REGEX = /^\s*var\(\s*(\-\-[a-zA-Z0-9\-_]+)\s*(?:,\s*(.*))?\)\s*$/;
const VARIABLE_PREFIX = 'var(';

export default class DarkColorHandlerImpl implements DarkColorHandler {
    private knownColors: Record<string, ModeIndependentColor> = {};

    constructor(private contentDiv: HTMLElement, private getDarkColor: (color: string) => string) {}

    registerDarkColor(
        key: string,
        lightModeColor: string,
        darkModeColor?: string | undefined
    ): void {
        if (!this.knownColors[key]) {
            darkModeColor = darkModeColor || this.getDarkColor(lightModeColor);
            this.knownColors[key] = { lightModeColor, darkModeColor };
            this.contentDiv.style.setProperty(key, darkModeColor);
        }
    }

    reset(): void {
        getObjectKeys(this.knownColors).forEach(key => this.contentDiv.style.removeProperty(key));
        this.knownColors = {};
    }

    parseColorValue(color: string | undefined | null): ColorKeyAndValue {
        let key: string | undefined;
        let lightModeColor = color || '';
        let darkModeColor: string | undefined;

        if (color) {
            const match = color.startsWith(VARIABLE_PREFIX) ? VARIABLE_REGEX.exec(color) : null;

            if (match) {
                if (match[2]) {
                    key = match[1];
                    lightModeColor = match[2];
                    darkModeColor = this.knownColors[key]?.darkModeColor;
                } else {
                    lightModeColor = '';
                }
            }
        }

        return { key, lightModeColor, darkModeColor };
    }
}
