import { createContext, useContext } from 'react';

export interface ActionContextValue {
    id: string;
    label?: string;
    isEnabled: boolean;
    isExecuting: boolean;
    execute: (fn: () => Promise<void>) => void;
}

const ActionContext = createContext<ActionContextValue | null>(null);

export function useActionContext(): ActionContextValue {
    const context = useContext(ActionContext);
    if (!context) {
        throw new Error('useActionContext must be used within an action block rendered by ScreenActions');
    }
    return context;
}

export default ActionContext;
