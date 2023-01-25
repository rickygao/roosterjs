export interface ColorKeyAndValue {
    key?: string;
    lightModeColor: string;
    darkModeColor?: string;
}

export default interface DarkColorHandler {
    registerColor(lightModeColor: string, isDarkMode: boolean, darkModeColor?: string): string;
    reset(): void;
    parseColorValue(color: string | null | undefined): ColorKeyAndValue;
}
