import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScreenProvider } from '../context/ScreenContext';
import useScreenContext from './useScreenContext';
import type { ScreenDefinition } from '../schema';

const baseScreen: ScreenDefinition = {
    id: 'test-screen',
    screenType: 'normal',
    actions: [],
    form: { rows: [] },
};

describe('useScreenContext', () => {
    it('throws when used outside a ScreenProvider', () => {
        expect(() => renderHook(() => useScreenContext())).toThrow(
            'useScreenContext must be used within a ScreenProvider'
        );
    });

    it('returns the screenDefinition from the provider', () => {
        const { result } = renderHook(() => useScreenContext(), {
            wrapper: ({ children }) => (
                <ScreenProvider screenDefinition={baseScreen} data={{}}>
                    {children}
                </ScreenProvider>
            ),
        });
        expect(result.current.screenDefinition).toBe(baseScreen);
    });

    it('returns the data from the provider', () => {
        const data = { name: 'Alice' };
        const { result } = renderHook(() => useScreenContext(), {
            wrapper: ({ children }) => (
                <ScreenProvider screenDefinition={baseScreen} data={data}>
                    {children}
                </ScreenProvider>
            ),
        });
        expect(result.current.data).toBe(data);
    });

    it('returns the first tab id as activeTabId by default', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [{ id: 'tab-a' }, { id: 'tab-b' }],
        };
        const { result } = renderHook(() => useScreenContext(), {
            wrapper: ({ children }) => (
                <ScreenProvider screenDefinition={screenDef} data={{}}>
                    {children}
                </ScreenProvider>
            ),
        });
        expect(result.current.activeTabId).toBe('tab-a');
    });

    it('returns activeTabId from screenDefinition when set', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            activeTabId: 'tab-b',
            tabs: [{ id: 'tab-a' }, { id: 'tab-b' }],
        };
        const { result } = renderHook(() => useScreenContext(), {
            wrapper: ({ children }) => (
                <ScreenProvider screenDefinition={screenDef} data={{}}>
                    {children}
                </ScreenProvider>
            ),
        });
        expect(result.current.activeTabId).toBe('tab-b');
    });

    it('updates activeTabId when setActiveTabId is called', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [{ id: 'tab-a' }, { id: 'tab-b' }],
        };
        const { result } = renderHook(() => useScreenContext(), {
            wrapper: ({ children }) => (
                <ScreenProvider screenDefinition={screenDef} data={{}}>
                    {children}
                </ScreenProvider>
            ),
        });
        act(() => result.current.setActiveTabId('tab-b'));
        expect(result.current.activeTabId).toBe('tab-b');
    });
});
