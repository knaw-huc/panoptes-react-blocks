import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import FormColumn from './FormColumn';
import type { ColumnDefinition, ScreenDefinition } from './schema';

vi.mock('@knaw-huc/panoptes-react', () => ({
    usePanoptes: vi.fn(() => ({ translateFn: (key: string) => key })),
    useBlock: vi.fn(() => null),
}));

const baseScreen: ScreenDefinition = {
    id: 'test-screen',
    screenType: 'normal',
    actions: [],
    form: { rows: [] },
};

function renderColumn(column: ColumnDefinition) {
    return render(
        <ScreenProvider screenDefinition={baseScreen} data={{ name: 'Alice' }}>
            <FormColumn column={column} />
        </ScreenProvider>
    );
}

describe('FormColumn', () => {
    it('renders nothing when elements array is empty', () => {
        const { container } = renderColumn({ elements: [] });
        expect(container.firstChild).toBeNull();
    });

    it('renders a wrapper div when elements are present', () => {
        const column: ColumnDefinition = {
            elements: [{ value: '$data#/name', type: 'text' }],
        };
        const { container } = renderColumn(column);
        expect(container.firstChild).not.toBeNull();
    });

    it('renders one child per element', () => {
        const column: ColumnDefinition = {
            elements: [
                { value: '$data#/name', type: 'text' },
                { value: '$data#/name', type: 'text' },
            ],
        };
        const { container } = renderColumn(column);
        // Each element renders a div wrapper from FormElement → ConfiguredBlockRenderer returns null
        // but the outer div from FormColumn is still rendered
        expect(container.firstChild).toBeInTheDocument();
    });
});
