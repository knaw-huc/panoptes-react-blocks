import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScreenProvider } from '../context/ScreenContext';
import useScreenState from './useScreenState';
import type { ScreenDefinition } from '../schema';

const baseScreen: ScreenDefinition = {
    id: 'test-screen',
    screenType: 'normal',
    actions: [],
    form: { rows: [] },
};

function makeWrapper(data: Record<string, unknown>) {
    return ({ children }: { children: React.ReactNode }) => (
        <ScreenProvider screenDefinition={baseScreen} data={data}>
            {children}
        </ScreenProvider>
    );
}

describe('useScreenState', () => {
    it('resolves a top-level $data binding', () => {
        const { result } = renderHook(() => useScreenState(), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.getValue('$data#/name')).toBe('Alice');
    });

    it('resolves a nested $data binding', () => {
        const { result } = renderHook(() => useScreenState(), {
            wrapper: makeWrapper({ user: { city: 'Amsterdam' } }),
        });
        expect(result.current.getValue('$data#/user/city')).toBe('Amsterdam');
    });

    it('returns undefined for a missing path', () => {
        const { result } = renderHook(() => useScreenState(), {
            wrapper: makeWrapper({}),
        });
        expect(result.current.getValue('$data#/missing')).toBeUndefined();
    });

    it('throws for an invalid binding expression', () => {
        const { result } = renderHook(() => useScreenState(), {
            wrapper: makeWrapper({}),
        });
        expect(() => result.current.getValue('not-a-binding')).toThrow();
    });
});
