import {evaluateVisibility, parseBinding, resolveBinding, type VisibleWhen} from '../schema';
import useScreenState from './useScreenState';
import {useItemData} from './useItemData';

export default function useVisibility(condition: VisibleWhen | undefined): boolean {

    const {getValue} = useScreenState();
    const itemData = useItemData();

    return evaluateVisibility(condition, (expression) => {
        const parsed = parseBinding(expression);
        if (parsed.source === 'itemData') {
            return resolveBinding(itemData, parsed.path);
        }
        return getValue(expression);
    });

}
