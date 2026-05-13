import {createContext, type ReactNode, useContext} from 'react';

export interface ItemDataContextValue {
    item: Record<string, unknown>;
    labelPathPrefix: string[];
}

const ItemDataContext = createContext<ItemDataContextValue | null>(null);

export function ItemDataProvider({
    item,
    labelPathPrefix = [],
    children,
}: {
    item: Record<string, unknown>;
    labelPathPrefix?: string[];
    children: ReactNode;
}) {
    const parent = useContext(ItemDataContext);
    const combinedPrefix = [...(parent?.labelPathPrefix ?? []), ...labelPathPrefix];
    return (
        <ItemDataContext.Provider value={{ item, labelPathPrefix: combinedPrefix }}>
            {children}
        </ItemDataContext.Provider>
    );
}

export default ItemDataContext;
