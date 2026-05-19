import {Suspense} from "react";
import type {ElementDefinition, RowDefinition} from "./schema";
import {type Block, useBlock, usePanoptes} from "@knaw-huc/panoptes-react";
import {useElementState, useScreenContext} from "./hooks";
import GhostLine from "../../ghostline/Ghostline.tsx";
import styles from './FormElement.module.css';
import {ErrorBoundary} from "react-error-boundary";
import {ItemDataProvider} from "./context/ItemDataContext.tsx";
import {bindingPathSegments, isBindingExpression, parseBinding, resolveBinding} from "./schema";

interface FormElementProps {
    element: ElementDefinition;
    groupId?: string;
}

const inferElementType = (value: unknown): string => {
    if (Array.isArray(value)) {
        return 'array';
    }
    if (typeof value === 'boolean') {
        return 'checkbox';
    }
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'string') {
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
            return 'date';
        }
        if (value.includes('\n')) {
            return 'textarea';
        }
    }
    return 'text';
}

const renderValue = (type: string, value: unknown,
                     element: ElementDefinition,
                     groupId?: string) => {
    const commonProps = {
        readOnly: true,
        disabled: true,
        'aria-label': element.label,
    };

    switch (type) {
        case 'prose':
            return (
                <span className='pr-4'>{String(value ?? '')}</span>
            );

        case 'checkbox':
            return (
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    {...commonProps}
                />
            );

        case 'number':
            return (
                <input
                    type="number"
                    value={value as number ?? ''}
                    {...commonProps}
                />
            );

        case 'date':
            return (
                <input
                    type="date"
                    value={String(value ?? '')}
                    {...commonProps}
                />
            );

        case 'textarea':
            return (
                <textarea
                    value={String(value ?? '')}
                    {...commonProps}
                />
            );

        case 'array':
            return (
                <ArrayDisplay
                    value={Array.isArray(value) ? value : [value]}
                    element={element}
                    groupId={groupId}
                />
            );

        case 'select': {
            const options = (element.config?.options as Array<{ value: string; label: string }>) || [];
            const selected = options.find(opt => opt.value === String(value ?? ''));
            return (
                <input
                    type="text"
                    value={selected?.label ?? String(value ?? '')}
                    {...commonProps}
                />
            );
        }

        case 'text':
        default:
            return (
                <input
                    type="text"
                    value={String(value ?? '')}
                    {...commonProps}
                />
            );
    }
}

const BlockWrapper = ({ Component, block }: { Component: React.ComponentType<{ block: Block }>, block: Block }) => (
    <Component block={block} />
);

const ConfiguredBlockRenderer = ({ element, groupId }: {
    element: ElementDefinition;
    groupId?: string;
}) => {
    const {
        value,
        label,
        infoLabel
    } = useElementState(element, groupId);
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;
    const BlockComponent = useBlock(element as Block);
    const screenContext = useScreenContext();

    if (!BlockComponent) {
        return null;
    }

    const block = { ...element, value, model: screenContext.data } as Block;
    return (
        <div className={styles.element}>
            {label && (
                <label className={styles.label}>
                    {translate(label)}
                </label>
            )}
            <Suspense fallback={<GhostLine/>}>
                <BlockWrapper Component={BlockComponent} block={block} />
            </Suspense>
            {infoLabel && (
                <span className={styles.info}>
                    {translate(infoLabel)}
                </span>
            )}
        </div>

    );
};

const FallbackBlockRenderer = ({ element, groupId }: FormElementProps) => {
    const { translateFn } = usePanoptes();
    const {
        value,
        label,
        infoLabel
    } = useElementState(element, groupId);
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const elementType = element.type || inferElementType(value);

    return (
        <div className={styles.element}>
            {label && (
                <label className={styles.label}>
                    {translate(label)}
                </label>
            )}

            {renderValue(elementType, value, element, groupId)}

            {infoLabel && (
                <span className={styles.info}>
                    {translate(infoLabel)}
                </span>
            )}
        </div>
    );
};

export default function FormElement({ element, groupId }: FormElementProps) {
    if (element.hidden) {
        return null;
    }

    return (
        <ErrorBoundary fallback={<FallbackBlockRenderer element={element} groupId={groupId} />}>
            <ConfiguredBlockRenderer element={element} groupId={groupId} />
        </ErrorBoundary>
    );
}

interface FlatItemTemplate {
    [key: string]: ElementDefinition;
}

interface RowsItemTemplate {
    rows: RowDefinition[];
}

type ItemTemplate = FlatItemTemplate | RowsItemTemplate;

function isRowsItemTemplate(template: ItemTemplate | undefined): template is RowsItemTemplate {
    return !!template && Array.isArray((template as RowsItemTemplate).rows);
}

interface ArrayDisplayProps {
    value: unknown[];
    element: ElementDefinition;
    groupId?: string;
}

function isEmptyBindingValue(item: unknown, value: ElementDefinition['value']): boolean {
    if (typeof value === 'string') {
        const parsed = parseBinding(value);
        const v = resolveBinding(item, parsed.path);
        return v == null || String(v).trim() === '';
    }
    if (Array.isArray(value)) {
        return value.every(v => isEmptyBindingValue(item, v));
    }
    if (value && typeof value === 'object') {
        return Object.values(value).every(v => isEmptyBindingValue(item, v));
    }
    return true;
}

function collectElementsFromRows(rows: RowDefinition[]): ElementDefinition[] {
    const result: ElementDefinition[] = [];
    for (const row of rows) {
        if (row.elements) result.push(...row.elements);
        if (row.columns) {
            for (const col of row.columns) {
                if (col.elements) result.push(...col.elements);
            }
        }
        if (row.rows) result.push(...collectElementsFromRows(row.rows));
    }
    return result;
}

function isEmptyItem(item: unknown, itemTemplate: ItemTemplate | undefined): boolean {
    if (!itemTemplate) {
        return item == null || String(item).trim() === '';
    }
    const elements = isRowsItemTemplate(itemTemplate)
        ? collectElementsFromRows(itemTemplate.rows)
        : Object.values(itemTemplate);
    return elements.every(field => isEmptyBindingValue(item, field.value));
}

function ItemTemplateRow({ row, groupId }: { row: RowDefinition; groupId?: string }) {
    return (
        <>
            {row.rows?.map((nested, i) => (
                <ItemTemplateRow key={`row-${i}`} row={nested} groupId={groupId} />
            ))}
            {row.columns?.map((col, i) => (
                <div key={`col-${i}`} className={styles.arrayItemFields}>
                    {col.elements?.map((el, j) => (
                        <div key={`el-${j}`} className={styles.arrayItemField}>
                            <FormElement element={el} groupId={groupId} />
                        </div>
                    ))}
                </div>
            ))}
            {row.elements && row.elements.length > 0 && (
                <div className={styles.arrayItemFields}>
                    {row.elements.map((el, i) => (
                        <div key={`el-${i}`} className={styles.arrayItemField}>
                            <FormElement element={el} groupId={groupId} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

function ArrayDisplay({ value, element, groupId }: ArrayDisplayProps) {
    const items = Array.isArray(value) ? value : [];
    const itemTemplate = element.config?.itemTemplate as ItemTemplate | undefined;

    if (items.length === 0 || items.every(item => isEmptyItem(item, itemTemplate))) {
        return null;
    }

    const arrayLabelPrefix = typeof element.value === 'string' && isBindingExpression(element.value)
        ? bindingPathSegments(parseBinding(element.value).path)
        : [];

    if (itemTemplate) {
        const rowsTemplate = isRowsItemTemplate(itemTemplate);
        return (
            <div className={styles.arrayInput}>
                {items.map((item, index) => (
                    <ItemDataProvider key={index} item={item as Record<string, unknown>} labelPathPrefix={arrayLabelPrefix}>
                        {!isEmptyItem(item, itemTemplate) && <div className={styles.arrayItem}>
                            {rowsTemplate ? (
                                <div className={styles.arrayItemRows}>
                                    {itemTemplate.rows.map((row, i) => (
                                        <ItemTemplateRow key={`row-${i}`} row={row} groupId={groupId} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.arrayItemFields}>
                                    {Object.entries(itemTemplate).map(([field, config]) => (
                                        <div key={field} className={styles.arrayItemField}>
                                            <FormElement element={config} groupId={groupId} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>}
                    </ItemDataProvider>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.arrayInput}>
            {items.map((item, index) => (
                <div key={index} className={styles.arrayItem}>
                    <input
                        type="text"
                        value={String(item ?? '')}
                        readOnly
                        disabled
                    />
                </div>
            ))}
        </div>
    );
}
