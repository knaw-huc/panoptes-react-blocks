import { useCallback } from 'react';
import { parseBinding, resolveBinding } from '../schema';
import {useScreenContext} from "../hooks";

export default function useScreenState() {
    const { data } = useScreenContext();

    const getValue = useCallback((expression: string): unknown => {
        const { path } = parseBinding(expression);
        return resolveBinding(data, path);
    }, [data]);

    return { getValue };
}
