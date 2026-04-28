import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useItemData } from './useItemData';
import { ItemDataProvider } from '../context/ItemDataContext';

describe('useItemData', () => {
    it('returns null when used outside an ItemDataProvider', () => {
        const { result } = renderHook(() => useItemData());
        expect(result.current).toBeNull();
    });

    it('returns the item data from the provider', () => {
        const item = { label: 'Test', count: 42 };
        const { result } = renderHook(() => useItemData(), {
            wrapper: ({ children }) => (
                <ItemDataProvider item={item}>{children}</ItemDataProvider>
            ),
        });
        expect(result.current).toEqual(item);
    });

    it('returns the exact same object reference provided', () => {
        const item = { id: 'abc' };
        const { result } = renderHook(() => useItemData(), {
            wrapper: ({ children }) => (
                <ItemDataProvider item={item}>{children}</ItemDataProvider>
            ),
        });
        expect(result.current).toBe(item);
    });
});
