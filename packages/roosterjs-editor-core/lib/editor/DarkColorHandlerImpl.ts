import { ColorKeyAndValue, DarkColorHandler, ModeIndependentColor } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';

const VARIABLE_REGEX = /^\s*var\(\s*(\-\-[a-zA-Z0-9\-_]+)\s*(?:,\s*(.*))?\)\s*$/;
const VARIABLE_PREFIX = 'var(';
const COLOR_VAR_PREFIX = 'darkColor';

export default class DarkColorHandlerImpl implements DarkColorHandler {
    private knownColors: Record<string, ModeIndependentColor> = {};

    constructor(private contentDiv: HTMLElement, private getDarkColor: (color: string) => string) {}

    registerColor(lightModeColor: string, isDarkMode: boolean, darkModeColor?: string): string {
        if (isDarkMode) {
            const colorKey = `--${COLOR_VAR_PREFIX}_${lightModeColor.replace(/[^\d\w]/g, '_')}`;

            if (!this.knownColors[colorKey]) {
                darkModeColor = darkModeColor || this.getDarkColor(lightModeColor);

                this.knownColors[colorKey] = { lightModeColor, darkModeColor };
                this.contentDiv.style.setProperty(colorKey, darkModeColor);
            }

            return `var(${colorKey}, ${lightModeColor})`;
        } else {
            return lightModeColor;
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
