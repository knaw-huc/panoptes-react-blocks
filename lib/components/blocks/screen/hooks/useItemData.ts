import {useContext} from "react";
import ItemDataContext from "../context/ItemDataContext.tsx";

export function useItemData(): Record<string, unknown> | null {
    const ctx = useContext(ItemDataContext);
    return ctx?.item ?? null;
}

export function useItemLabelPrefix(): string[] {
    const ctx = useContext(ItemDataContext);
    return ctx?.labelPathPrefix ?? [];
}
