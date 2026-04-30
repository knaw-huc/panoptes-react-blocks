import { describe, it, expect } from 'vitest';
import { parseBinding, resolveBinding, bindingPathSegments, isBindingExpression } from './binding';

describe('isBindingExpression', () => {
    it('accepts a $data binding', () => {
        expect(isBindingExpression('$data#$.foo.bar')).toBe(true);
    });

    it('accepts a $itemData binding', () => {
        expect(isBindingExpression('$itemData#$.metadata.title')).toBe(true);
    });

    it('rejects a plain string', () => {
        expect(isBindingExpression('not-a-binding')).toBe(false);
    });

    it('rejects the old JSON Pointer syntax', () => {
        expect(isBindingExpression('$data#/foo/bar')).toBe(false);
    });
});

describe('parseBinding', () => {
    it('parses a simple data binding', () => {
        expect(parseBinding('$data#$.foo.bar')).toEqual({
            source: 'data',
            path: '$.foo.bar',
            expression: '$data#$.foo.bar',
        });
    });

    it('parses a simple itemData binding', () => {
        expect(parseBinding('$itemData#$.metadata.title')).toEqual({
            source: 'itemData',
            path: '$.metadata.title',
            expression: '$itemData#$.metadata.title',
        });
    });

    it('parses array index syntax', () => {
        expect(parseBinding('$data#$.items[0].title').path).toBe('$.items[0].title');
    });

    it('parses wildcard syntax', () => {
        expect(parseBinding('$data#$.items[*].title').path).toBe('$.items[*].title');
    });

    it('parses bracket notation with quoted keys', () => {
        expect(parseBinding("$data#$['weird key'].value").path).toBe("$['weird key'].value");
    });

    it('throws on an invalid binding expression', () => {
        expect(() => parseBinding('not-a-binding')).toThrow();
    });

    it('throws on the old pointer syntax', () => {
        expect(() => parseBinding('$data#/foo/bar')).toThrow();
    });
});

describe('resolveBinding', () => {
    it('resolves a single nested value', () => {
        const data = { user: { city: 'Amsterdam' } };
        expect(resolveBinding(data, '$.user.city')).toBe('Amsterdam');
    });

    it('resolves an array index', () => {
        const data = { items: [{ title: 'first' }, { title: 'second' }] };
        expect(resolveBinding(data, '$.items[1].title')).toBe('second');
    });

    it('returns undefined for missing paths', () => {
        expect(resolveBinding({ foo: 1 }, '$.bar')).toBeUndefined();
    });

    it('returns undefined when input is null/undefined', () => {
        expect(resolveBinding(null, '$.foo')).toBeUndefined();
        expect(resolveBinding(undefined, '$.foo')).toBeUndefined();
    });

    it('returns an array when the expression matches multiple values (wildcard)', () => {
        const data = { items: [{ title: 'a' }, { title: 'b' }, { title: 'c' }] };
        expect(resolveBinding(data, '$.items[*].title')).toEqual(['a', 'b', 'c']);
    });

    it('supports filter expressions', () => {
        const data = { items: [{ n: 1 }, { n: 2 }, { n: 3 }] };
        expect(resolveBinding(data, '$.items[?(@.n>1)].n')).toEqual([2, 3]);
    });

    it('resolves keys containing a slash via bracket notation', () => {
        const data = { metadata: { 'Caption/Abstract': 'hello' } };
        expect(resolveBinding(data, "$.metadata['Caption/Abstract']")).toBe('hello');
    });
});

describe('bindingPathSegments', () => {
    it('returns dot-path segments without the root', () => {
        expect(bindingPathSegments('$.user.city')).toEqual(['user', 'city']);
    });

    it('flattens array indices into segments', () => {
        expect(bindingPathSegments('$.items[0].title')).toEqual(['items', '0', 'title']);
    });

    it('preserves wildcard segments', () => {
        expect(bindingPathSegments('$.items[*].title')).toEqual(['items', '*', 'title']);
    });

    it('unquotes bracket-notation keys', () => {
        expect(bindingPathSegments("$.metadata['Caption/Abstract']")).toEqual([
            'metadata',
            'Caption/Abstract',
        ]);
    });
});
