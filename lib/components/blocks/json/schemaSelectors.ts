import type {JsonSchema} from "./index.tsx";

export function deepGet(obj: Record<string, unknown> | null | undefined,
                        path: string,
                        defaultValue?: unknown): unknown {
    const segments = path.split('.');
    const result = segments.reduce<Record<string, unknown> | unknown>(
        (current, key) => current != null && typeof current === 'object' ?
                    (current as Record<string, unknown>)[key] : undefined, obj);
    return result === undefined ? defaultValue : result;
}

export const omitProperty = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.hidden`, false) as boolean;
}

export const isLink = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.type`, '') === 'link';
}

export const isExternalLink = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.type`) === 'external-link';
}

export const isMarkdownHTML = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.type`) === 'markdown';
}

export const getLinkTo = (schema: JsonSchema, propertyName: string): string => {
    return deepGet(schema, `${propertyName}.url`, '') as string;
}
