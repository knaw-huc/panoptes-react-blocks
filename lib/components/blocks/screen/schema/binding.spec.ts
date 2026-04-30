import { describe, it, expect } from 'vitest';
import { parseBinding, getNestedValue } from './binding';

describe('parseBinding', () => {
    it('parses a simple data binding', () => {
        expect(parseBinding('$data#/foo/bar')).toEqual({
            source: 'data',
            path: ['foo', 'bar'],
            rawPath: 'foo/bar',
        });
    });

    it('parses a simple itemData binding', () => {
        expect(parseBinding('$itemData#/metadata/title')).toEqual({
            source: 'itemData',
            path: ['metadata', 'title'],
            rawPath: 'metadata/title',
        });
    });

    it('unescapes ~1 to / inside a key segment', () => {
        const parsed = parseBinding('$itemData#/metadata/Caption~1Abstract');
        expect(parsed.path).toEqual(['metadata', 'Caption/Abstract']);
    });

    it('unescapes ~0 to ~ inside a key segment', () => {
        const parsed = parseBinding('$data#/weird~0key');
        expect(parsed.path).toEqual(['weird~key']);
    });

    it('unescapes ~01 as a literal ~1 (not as /)', () => {
        const parsed = parseBinding('$data#/literal~01');
        expect(parsed.path).toEqual(['literal~1']);
    });

    it('throws on an invalid binding expression', () => {
        expect(() => parseBinding('not-a-binding')).toThrow();
    });
});

describe('getNestedValue with escaped keys', () => {
    it('resolves a key that contains a slash', () => {
        const data = { metadata: { 'Caption/Abstract': 'hello' } };
        const { path } = parseBinding('$itemData#/metadata/Caption~1Abstract');
        expect(getNestedValue(data, path)).toBe('hello');
    });
});
