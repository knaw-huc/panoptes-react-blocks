import {describe, it, expect} from 'vitest';
import {evaluateVisibility} from './visibility';
import type {VisibleWhen} from './types';

function fixedResolver(value: unknown) {
    return () => value;
}

describe('evaluateVisibility', () => {

    it('returns true when no condition is given', () => {
        expect(evaluateVisibility(undefined, () => undefined)).toBe(true);
    });

    it('returns true when condition has only a binding (no comparators)', () => {
        const condition: VisibleWhen = {binding: '$data#$.foo'};
        expect(evaluateVisibility(condition, fixedResolver('anything'))).toBe(true);
    });

    describe('equals', () => {
        it('matches when values are strictly equal', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', equals: 'application/pdf'};
            expect(evaluateVisibility(condition, fixedResolver('application/pdf'))).toBe(true);
        });

        it('does not match when values differ', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', equals: 'application/pdf'};
            expect(evaluateVisibility(condition, fixedResolver('image/jpeg'))).toBe(false);
        });
    });

    describe('startsWith', () => {
        it('matches a string prefix', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', startsWith: 'image/'};
            expect(evaluateVisibility(condition, fixedResolver('image/jpeg'))).toBe(true);
        });

        it('does not match when prefix differs', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', startsWith: 'image/'};
            expect(evaluateVisibility(condition, fixedResolver('application/pdf'))).toBe(false);
        });

        it('does not match a non-string value', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', startsWith: 'image/'};
            expect(evaluateVisibility(condition, fixedResolver(42))).toBe(false);
        });
    });

    describe('oneOf', () => {
        it('matches when value is in the list', () => {
            const condition: VisibleWhen = {
                binding: '$data#$.t',
                oneOf: ['application/msword', 'application/vnd.ms-excel'],
            };
            expect(evaluateVisibility(condition, fixedResolver('application/msword'))).toBe(true);
        });

        it('does not match when value is absent', () => {
            const condition: VisibleWhen = {
                binding: '$data#$.t',
                oneOf: ['application/msword'],
            };
            expect(evaluateVisibility(condition, fixedResolver('image/jpeg'))).toBe(false);
        });
    });

    describe('matches', () => {
        it('matches a regex', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', matches: '^(audio|video)/'};
            expect(evaluateVisibility(condition, fixedResolver('audio/mpeg'))).toBe(true);
            expect(evaluateVisibility(condition, fixedResolver('video/mp4'))).toBe(true);
        });

        it('does not match unrelated strings', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', matches: '^(audio|video)/'};
            expect(evaluateVisibility(condition, fixedResolver('image/jpeg'))).toBe(false);
        });
    });

    describe('multi-comparator OR semantics', () => {
        it('matches when any comparator is satisfied', () => {
            const condition: VisibleWhen = {
                binding: '$data#$.t',
                startsWith: 'image/',
                equals: 'application/pdf',
            };
            expect(evaluateVisibility(condition, fixedResolver('image/png'))).toBe(true);
            expect(evaluateVisibility(condition, fixedResolver('application/pdf'))).toBe(true);
            expect(evaluateVisibility(condition, fixedResolver('audio/mpeg'))).toBe(false);
        });
    });

    describe('array values', () => {
        it('matches when any element of a resolved array satisfies the condition', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', equals: 'pdf'};
            expect(evaluateVisibility(condition, fixedResolver(['doc', 'pdf', 'png']))).toBe(true);
        });

        it('does not match when no element of the array satisfies', () => {
            const condition: VisibleWhen = {binding: '$data#$.t', equals: 'pdf'};
            expect(evaluateVisibility(condition, fixedResolver(['doc', 'png']))).toBe(false);
        });
    });

});
