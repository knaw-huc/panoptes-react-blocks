import {useScreenContext} from "./hooks";
import FormRow from './FormRow';
import type {RowDefinition} from "./schema";
import styles from './ScreenForm.module.css';

function isOnTab(row: RowDefinition, activeTabId: string): boolean {
    if (row.tabId === undefined) {
        return true;
    }
    if (Array.isArray(row.tabId)) {
        return row.tabId.includes(activeTabId);
    }
    return row.tabId === activeTabId;
}

export default function ScreenForm() {
    const { screenDefinition, activeTabId } = useScreenContext();
    const { form } = screenDefinition;

    if (!form || !form.rows) {
        return null;
    }

    const visibleRows = form.rows.filter(row => isOnTab(row, activeTabId));

    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {visibleRows.map((row, index) => (
                <FormRow key={row.groupId || `row-${index}`} row={row} />
            ))}
        </form>
    );
}
