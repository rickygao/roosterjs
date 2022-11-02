import * as React from 'react';
import { css } from '@fluentui/react/lib/Utilities';

const styles = require('./ButtonGroup.scss');

export function ButtonGroup(props: {
    hasFormat: boolean;
    hasContent: boolean;
    hasMetadata: boolean;
    bodyState: 'children' | 'format' | 'json' | 'collapsed' | 'metadata';
    toggleVisual: () => void;
    toggleFormat: () => void;
    toggleJson: () => void;
    toggleMetadata: () => void;
}) {
    const {
        hasContent,
        hasFormat,
        hasMetadata,
        bodyState,
        toggleFormat,
        toggleJson,
        toggleVisual,
        toggleMetadata,
    } = props;

    return (
        <div>
            {hasContent ? (
                <button
                    onClick={toggleVisual}
                    title="Content"
                    className={css(styles.button, {
                        [styles.buttonChecked]: bodyState == 'children',
                    })}>
                    🔎
                </button>
            ) : null}
            {hasFormat ? (
                <button
                    onClick={toggleFormat}
                    title="Format"
                    className={css(styles.button, {
                        [styles.buttonChecked]: bodyState == 'format',
                    })}>
                    🖹
                </button>
            ) : null}
            {hasMetadata ? (
                <button
                    onClick={toggleMetadata}
                    title="Metadata"
                    className={css(styles.button, {
                        [styles.buttonChecked]: bodyState == 'metadata',
                    })}>
                    🏴
                </button>
            ) : null}
            <button
                onClick={toggleJson}
                title="JSON"
                className={css(styles.button, {
                    [styles.buttonChecked]: bodyState == 'json',
                })}>
                🅙
            </button>
        </div>
    );
}
