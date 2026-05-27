import { useState, useCallback, useRef } from 'react';
import { BlockLoader, usePanoptes } from '@knaw-huc/panoptes-react';
import type { Block } from '@knaw-huc/panoptes-react';
import styles from './ScreenAction.module.css';
import { useScreenContext } from './hooks';
import type { ActionDefinition } from './schema';
import ActionContext, { type ActionContextValue } from './context/ActionContext.tsx';

export interface ActionBlock extends Block {
    type: 'action';
    value: null;
    config: ActionDefinition;
}

export default function ActionBlockRenderer({ block }: { block: Block }) {
    const action = (block as ActionBlock).config;
    const { screenDefinition } = useScreenContext();
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const pendingFnRef = useRef<(() => Promise<void>) | null>(null);

    const execute = useCallback((fn: () => Promise<void>) => {
        if (action.confirmation.askConfirmation === 'always') {
            pendingFnRef.current = fn;
            setShowConfirmation(true);
        } else {
            setIsExecuting(true);
            fn().finally(() => setIsExecuting(false));
        }
    }, [action.confirmation.askConfirmation]);

    const handleConfirm = useCallback(async () => {
        const fn = pendingFnRef.current;
        if (!fn) return;
        pendingFnRef.current = null;
        setShowConfirmation(false);
        setIsExecuting(true);
        try { await fn(); } finally { setIsExecuting(false); }
    }, []);

    const handleCancel = useCallback(() => {
        pendingFnRef.current = null;
        setShowConfirmation(false);
    }, []);

    const autoKey = `screens.${screenDefinition.id}.actions.${action.id}`;
    const labels = action.confirmation.labels;

    const contextValue: ActionContextValue = {
        id: action.id,
        label: translate(action.label ?? autoKey),
        isEnabled: !isExecuting,
        isExecuting,
        execute,
    };

    return (
        <ActionContext.Provider value={contextValue}>
            <div data-action-id={action.id}>
                <BlockLoader block={action.block} />

                {showConfirmation && (
                    <div className={styles.confirmationOverlay}>
                        <div className={styles.confirmationDialog} role="dialog" aria-modal="true">
                            <h2 className={styles.confirmationTitle}>
                                {translate(labels?.title ?? `${autoKey}.title`)}
                            </h2>
                            <p className={styles.confirmationMessage}>
                                {translate(labels?.message ?? `${autoKey}.message`)}
                            </p>
                            <div className={styles.confirmationActions}>
                                <button
                                    className={styles.confirmationCancel}
                                    onClick={handleCancel}>
                                    {translate(labels?.cancel ?? `${autoKey}.cancel`)}
                                </button>
                                <button
                                    className={styles.confirmationOk}
                                    onClick={handleConfirm}>
                                    {translate(labels?.ok ?? `${autoKey}.ok`)}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ActionContext.Provider>
    );
}
