import {renderHook} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import type {ReactNode} from 'react';
import useVisibility from './useVisibility';
import {ScreenProvider} from '../context/ScreenContext';
import {ItemDataProvider} from '../context/ItemDataContext';
import type {ScreenDefinition, VisibleWhen} from '../schema';

const baseScreen: ScreenDefinition = {
    id: 'test-screen',
    screenType: 'normal',
    actions: [],
    form: {rows: []},
};

function makeWrapper(data: Record<string, unknown>, item?: Record<string, unknown>) {
    return ({children}: { children: ReactNode }) => {
        const tree = (
            <ScreenProvider screenDefinition={baseScreen} data={data}>
                {children}
            </ScreenProvider>
        );
        return item
            ? <ItemDataProvider item={item}>{tree}</ItemDataProvider>
            : tree;
    };
}

describe('useVisibility', () => {

    it('returns true when no condition is given', () => {
        const {result} = renderHook(() => useVisibility(undefined), {
            wrapper: makeWrapper({}),
        });
        expect(result.current).toBe(true);
    });

    it('returns true when condition has only a binding (no comparators)', () => {
        const condition: VisibleWhen = {binding: '$data#$.foo'};
        const {result} = renderHook(() => useVisibility(condition), {
            wrapper: makeWrapper({foo: 'bar'}),
        });
        expect(result.current).toBe(true);
    });

    describe('with $data binding', () => {
        it('resolves a value from screen data and matches equals', () => {
            const condition: VisibleWhen = {binding: '$data#$.mimeType', equals: 'application/pdf'};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({mimeType: 'application/pdf'}),
            });
            expect(result.current).toBe(true);
        });

        it('returns false when value does not satisfy condition', () => {
            const condition: VisibleWhen = {binding: '$data#$.mimeType', equals: 'application/pdf'};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({mimeType: 'image/jpeg'}),
            });
            expect(result.current).toBe(false);
        });

        it('resolves a nested path', () => {
            const condition: VisibleWhen = {binding: '$data#$.user.role', oneOf: ['admin', 'editor']};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({user: {role: 'editor'}}),
            });
            expect(result.current).toBe(true);
        });

        it('treats a missing path as undefined for exists: false', () => {
            const condition: VisibleWhen = {binding: '$data#$.missing', exists: false};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({}),
            });
            expect(result.current).toBe(true);
        });

        it('treats a missing path as undefined for exists: true', () => {
            const condition: VisibleWhen = {binding: '$data#$.missing', exists: true};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({}),
            });
            expect(result.current).toBe(false);
        });
    });

    describe('with $itemData binding', () => {
        it('resolves a value from the ItemDataProvider', () => {
            const condition: VisibleWhen = {binding: '$itemData#$.status', equals: 'published'};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({}, {status: 'published'}),
            });
            expect(result.current).toBe(true);
        });

        it('returns false when the item value does not satisfy the condition', () => {
            const condition: VisibleWhen = {binding: '$itemData#$.status', equals: 'published'};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({}, {status: 'draft'}),
            });
            expect(result.current).toBe(false);
        });

        it('prefers itemData over screen data for $itemData bindings', () => {
            const condition: VisibleWhen = {binding: '$itemData#$.label', equals: 'from-item'};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({label: 'from-screen'}, {label: 'from-item'}),
            });
            expect(result.current).toBe(true);
        });

        it('returns false when $itemData binding has no ItemDataProvider', () => {
            const condition: VisibleWhen = {binding: '$itemData#$.status', exists: true};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({}),
            });
            expect(result.current).toBe(false);
        });
    });

    describe('array values', () => {
        it('matches when any element of a resolved array satisfies the condition', () => {
            const condition: VisibleWhen = {binding: '$data#$.tags', equals: 'pdf'};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({tags: ['doc', 'pdf', 'png']}),
            });
            expect(result.current).toBe(true);
        });

        it('does not match when no element satisfies the condition', () => {
            const condition: VisibleWhen = {binding: '$data#$.tags', equals: 'pdf'};
            const {result} = renderHook(() => useVisibility(condition), {
                wrapper: makeWrapper({tags: ['doc', 'png']}),
            });
            expect(result.current).toBe(false);
        });
    });

    describe('invalid binding', () => {
        it('throws for a malformed binding expression', () => {
            const condition: VisibleWhen = {binding: 'not-a-binding', equals: 'x'};
            expect(() =>
                renderHook(() => useVisibility(condition), {
                    wrapper: makeWrapper({}),
                }),
            ).toThrow();
        });
    });

});
