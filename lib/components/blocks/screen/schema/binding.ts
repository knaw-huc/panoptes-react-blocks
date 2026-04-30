import { JSONPath } from 'jsonpath-plus';

export interface ParsedBinding {
    source: 'data' | 'itemData';
    path: string;
    expression: string;
}

const BINDING_REGEX = /^\$(data|itemData)#(\$.*)$/;

export function isBindingExpression(value: unknown): boolean {
    return typeof value === 'string' && BINDING_REGEX.test(value);
}

export function parseBinding(expression: string): ParsedBinding {
    const match = expression.match(BINDING_REGEX);
    if (!match) {
        throw new Error(
            `Invalid binding expression: ${expression}. Expected format: $data#$.<jsonpath> or $itemData#$.<jsonpath>`,
        );
    }
    return {
        source: match[1] as 'data' | 'itemData',
        path: match[2],
        expression,
    };
}

export function resolveBinding(data: unknown, path: string): unknown {
    if (data === null || data === undefined) {
        return undefined;
    }
    return JSONPath({ path, json: data as object, wrap: false });
}

export function bindingPathSegments(path: string): string[] {
    try {
        const arr = JSONPath.toPathArray(path) as string[];
        return arr.slice(1);
    } catch {
        return [];
    }
}
