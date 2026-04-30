import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScreenProvider } from '../context/ScreenContext';
import { ItemDataProvider } from '../context/ItemDataContext';
import useElementState from './useElementState';
import type { ElementDefinition, ScreenDefinition } from '../schema';

const baseScreen: ScreenDefinition = {
    id: 'test-screen',
    screenType: 'normal',
    actions: [],
    form: { rows: [] },
};

function makeWrapper(
    data: Record<string, unknown>,
    itemData?: Record<string, unknown>
) {
    return ({ children }: { children: React.ReactNode }) => {
        const inner = (
            <ScreenProvider screenDefinition={baseScreen} data={data}>
                {children}
            </ScreenProvider>
        );
        return itemData
            ? <ItemDataProvider item={itemData}>{inner}</ItemDataProvider>
            : inner;
    };
}

describe('useElementState — value resolution', () => {
    it('resolves a $data binding to the corresponding data value', () => {
        const element: ElementDefinition = { value: '$data#/name' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.value).toBe('Alice');
    });

    it('resolves a nested $data binding', () => {
        const element: ElementDefinition = { value: '$data#/user/city' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ user: { city: 'Amsterdam' } }),
        });
        expect(result.current.value).toBe('Amsterdam');
    });

    it('resolves a $itemData binding from ItemDataProvider', () => {
        const element: ElementDefinition = { value: '$itemData#/label' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({}, { label: 'Row Label' }),
        });
        expect(result.current.value).toBe('Row Label');
    });

    it('resolves an array of bindings to an array of values', () => {
        const element: ElementDefinition = { value: ['$data#/first', '$data#/last'] };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ first: 'John', last: 'Doe' }),
        });
        expect(result.current.value).toEqual(['John', 'Doe']);
    });

    it('resolves an object of bindings to an object of values', () => {
        const element: ElementDefinition = {
            value: { latitude: '$data#/lat', longitude: '$data#/lon' },
        };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ lat: 52.37, lon: 4.89 }),
        });
        expect(result.current.value).toEqual({ latitude: 52.37, longitude: 4.89 });
    });
});

describe('useElementState — label resolution', () => {
    it('returns the explicit element label when provided', () => {
        const element: ElementDefinition = { value: '$data#/name', label: 'Full Name' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.label).toBe('Full Name');
    });

    it('generates an auto label key from the binding path when no label is set', () => {
        const element: ElementDefinition = { value: '$data#/name' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        // auto key: screens.<screenId>.<path>
        expect(result.current.label).toBe('screens.test-screen.name');
    });

    it('includes groupId in the auto label key when provided', () => {
        const element: ElementDefinition = { value: '$data#/name' };
        const { result } = renderHook(() => useElementState(element, 'personal'), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.label).toBe('screens.test-screen.personal.name');
    });

    it('replaces colons in path segments so i18next does not treat them as namespace separators', () => {
        const element: ElementDefinition = { value: '$data#/metadata/dc:title' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ metadata: { 'dc:title': 'A title' } }),
        });
        expect(result.current.label).toBe('screens.test-screen.metadata.dc_title');
    });

    it('replaces whitespace in path segments so the key stays a single i18next token', () => {
        const element: ElementDefinition = { value: '$data#/metadata/full name' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ metadata: { 'full name': 'Alice' } }),
        });
        expect(result.current.label).toBe('screens.test-screen.metadata.full_name');
    });
});

describe('useElementState — infoLabel resolution', () => {
    it('returns the explicit infoLabel when provided', () => {
        const element: ElementDefinition = { value: '$data#/name', infoLabel: 'Custom Info' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.infoLabel).toBe('Custom Info');
    });

    it('generates an auto info label key based on the auto label key', () => {
        const element: ElementDefinition = { value: '$data#/name' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.infoLabel).toBe('screens.test-screen.name.info');
    });
});

describe('useElementState — hidden', () => {
    it('returns hidden: false by default', () => {
        const element: ElementDefinition = { value: '$data#/name' };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.hidden).toBe(false);
    });

    it('returns hidden: true when element.hidden is true', () => {
        const element: ElementDefinition = { value: '$data#/name', hidden: true };
        const { result } = renderHook(() => useElementState(element), {
            wrapper: makeWrapper({ name: 'Alice' }),
        });
        expect(result.current.hidden).toBe(true);
    });
});
