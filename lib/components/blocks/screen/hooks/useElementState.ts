import type {ElementDefinition} from "../schema";
import useScreenState from "./useScreenState.ts";
import {bindingPathSegments, isBindingExpression, parseBinding, resolveBinding} from "../schema";
import {useItemData, useItemLabelPrefix} from "./useItemData.ts";
import useScreenContext from "./useScreenContext.ts";

function sanitizeKeySegment(segment: string): string {
    return segment.replace(/[:\s]/g, '_');
}

function buildLabelKey(screenId: string, groupId: string | undefined, segments: string[]): string {
    const parts = ['screens', screenId];
    if (groupId) parts.push(groupId);
    parts.push(...segments.map(sanitizeKeySegment));
    return parts.join('.');
}

export default function useElementState(element: ElementDefinition, groupId?: string) {
    const { getValue } = useScreenState();
    const itemData = useItemData();
    const itemLabelPrefix = useItemLabelPrefix();
    const { screenDefinition } = useScreenContext();

    const resolveValue = (expression: string): unknown => {
        const parsed = parseBinding(expression);
        if (parsed.source === 'itemData') {
            return resolveBinding(itemData, parsed.path);
        }
        return getValue(expression);
    };

    let autoLabelKey: string | undefined;
    if (typeof element.value === 'string' && isBindingExpression(element.value)) {
        const parsed = parseBinding(element.value);
        const fieldSegments = bindingPathSegments(parsed.path);
        const segments = parsed.source === 'itemData'
            ? [...itemLabelPrefix, ...fieldSegments]
            : fieldSegments;
        autoLabelKey = buildLabelKey(screenDefinition.id, groupId, segments);
    }

    const resolvedValue = Array.isArray(element.value)
        ? element.value.map(resolveValue)
        : typeof element.value === 'object' && element.value !== null
            ? Object.fromEntries(Object.entries(element.value).map(([k, v]) => [k, resolveValue(v)]))
            : resolveValue(element.value);

    return {
        value: resolvedValue,
        hidden: element.hidden ?? false,
        label: element.label ?? autoLabelKey,
        infoLabel: element.infoLabel ?? (autoLabelKey ? `${autoLabelKey}.info` : undefined),
        config: element.config,
    };
}
