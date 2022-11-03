import * as React from 'react';
import { ButtonGroup } from './ButtonGroup';
import { ContentModelJson } from './model/ContentModelJson';
import { css } from '@fluentui/react/lib/Utilities';
import { useProperty } from '../hooks/useProperty';

const styles = require('./ContentModelView.scss');

export function ContentModelView(props: {
    className: string;
    title: string;
    subTitle?: string;
    hasSelection?: boolean;
    isSelected?: boolean;
    jsonSource: Object;
    getContent?: (() => JSX.Element) | null;
    getFormat?: (() => JSX.Element) | null;
    getMetadata?: (() => JSX.Element) | null;
    isExpanded?: boolean;
}) {
    const {
        title,
        subTitle,
        isExpanded,
        className,
        hasSelection,
        isSelected: isSelection,
        jsonSource,
        getContent,
        getFormat,
        getMetadata,
    } = props;
    const [bodyState, setBodyState] = useProperty<
        'collapsed' | 'children' | 'format' | 'json' | 'metadata'
    >(isExpanded ? 'children' : 'collapsed');

    const toggleVisual = React.useCallback(() => {
        setBodyState(bodyState == 'children' ? 'collapsed' : 'children');
    }, [bodyState]);

    const toggleFormat = React.useCallback(() => {
        setBodyState(bodyState == 'format' ? 'collapsed' : 'format');
    }, [bodyState]);

    const toggleJson = React.useCallback(() => {
        setBodyState(bodyState == 'json' ? 'collapsed' : 'json');
    }, [bodyState]);

    const toggleMetadata = React.useCallback(() => {
        setBodyState(bodyState == 'metadata' ? 'collapsed' : 'metadata');
    }, [bodyState]);

    return (
        <div
            className={css(styles.modelWrapper, className, {
                [styles.childSelected]: hasSelection,
                [styles.selected]: isSelection,
            })}>
            <div className={styles.titleBar}>
                <div
                    className={css(styles.title, {
                        [styles.titleWithBorder]: bodyState != 'collapsed',
                    })}>
                    {title}
                </div>
                <div className={styles.buttonGroup}>
                    <ButtonGroup
                        hasContent={!!getContent}
                        hasFormat={!!getFormat}
                        hasMetadata={!!getMetadata}
                        bodyState={bodyState}
                        toggleJson={toggleJson}
                        toggleFormat={toggleFormat}
                        toggleVisual={toggleVisual}
                        toggleMetadata={toggleMetadata}
                    />
                </div>
                <div
                    className={css(styles.subTitle, {
                        [styles.titleWithBorder]: bodyState != 'collapsed',
                    })}
                    title={subTitle || ''}>
                    {subTitle || '\u00a0'}
                </div>
            </div>
            {bodyState == 'json' ? (
                <div className={styles.expandedBody}>
                    <ContentModelJson jsonSource={jsonSource} />
                </div>
            ) : bodyState == 'children' && !!getContent ? (
                <div className={styles.expandedBody}>{getContent()}</div>
            ) : bodyState == 'format' && !!getFormat ? (
                <div className={styles.expandedBody}>{getFormat()}</div>
            ) : bodyState == 'metadata' && !!getMetadata ? (
                <div className={styles.expandedBody}>{getMetadata()}</div>
            ) : null}
        </div>
    );
}
