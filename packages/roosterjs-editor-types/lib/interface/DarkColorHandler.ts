export interface ColorKeyAndValue {
    key?: string;
    lightModeColor: string;
    darkModeColor?: string;
}

export default interface DarkColorHandler {
    registerDarkColor(key: string, lightModeColor: string, darkModeColor?: string): void;
    reset(): void;
    parseColorValue(color: string | null | undefined): ColorKeyAndValue;
}
