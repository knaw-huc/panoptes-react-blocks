import type {VisibleWhen} from './types';

export type BindingResolver = (expression: string) => unknown;

function isEmpty(value: unknown): boolean {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === 'string') {
        return value.trim() === '';
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    return false;
}

function hasAnyComparator(condition: VisibleWhen): boolean {
    return condition.equals !== undefined
        || condition.startsWith !== undefined
        || condition.oneOf !== undefined
        || condition.matches !== undefined
        || condition.exists !== undefined;
}

function matchValue(value: unknown, condition: VisibleWhen): boolean {
    if (condition.equals !== undefined && value === condition.equals) {
        return true;
    }
    if (condition.startsWith !== undefined && typeof value === 'string' && value.startsWith(condition.startsWith)) {
        return true;
    }
    if (condition.oneOf !== undefined && condition.oneOf.some(v => v === value)) {
        return true;
    }
    if (condition.matches !== undefined && typeof value === 'string' && new RegExp(condition.matches).test(value)) {
        return true;
    }
    if (condition.exists !== undefined) {
        const present = !isEmpty(value);
        if (condition.exists ? present : !present) return true;
    }
    return false;
}

export function evaluateVisibility(condition: VisibleWhen | undefined, resolve: BindingResolver): boolean {
    if (!condition) {
        return true;
    }
    if (!hasAnyComparator(condition)) {
        return true;
    }

    const resolved = resolve(condition.binding);
    const values = Array.isArray(resolved) ? resolved : [resolved];

    return values.some(v => matchValue(v, condition));
}
