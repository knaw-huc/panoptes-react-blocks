import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import FormElement from './FormElement';
import type { ElementDefinition, ScreenDefinition } from './schema';
import { useBlock } from '@knaw-huc/panoptes-react';

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

function renderElement(element: ElementDefinition, data: Record<string, unknown> = {}) {
    return render(
        <ScreenProvider screenDefinition={baseScreen} data={data}>
            <FormElement element={element} />
        </ScreenProvider>
    );
}

function useThrowingBlock() {
    vi.mocked(useBlock).mockReturnValue(() => { throw new Error('No block registered'); });
}

describe('FormElement — hidden elements', () => {
    it('renders nothing when element.hidden is true', () => {
        const { container } = renderElement({ value: '$data#/name', hidden: true }, { name: 'Alice' });
        expect(container.firstChild).toBeNull();
    });
});

describe('FormElement — FallbackBlockRenderer (via ErrorBoundary)', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        useThrowingBlock();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useBlock).mockReturnValue(null as any);
    });

    it('renders a text input for a string value', () => {
        renderElement({ value: '$data#/name', type: 'text' }, { name: 'Alice' });
        expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('renders a textarea for a multiline string value', () => {
        renderElement({ value: '$data#/bio' }, { bio: 'Line one\nLine two' });
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(document.querySelector('textarea')).toBeInTheDocument();
    });

    it('renders a number input for a numeric value', () => {
        renderElement({ value: '$data#/age' }, { age: 30 });
        expect(document.querySelector('input[type="number"]')).toBeInTheDocument();
        expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });

    it('renders a date input for a date-formatted string', () => {
        renderElement({ value: '$data#/dob' }, { dob: '1990-05-15' });
        expect(document.querySelector('input[type="date"]')).toBeInTheDocument();
    });

    it('renders a checkbox for a boolean value', () => {
        renderElement({ value: '$data#/active' }, { active: true });
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
    });

    it('renders an unchecked checkbox for false', () => {
        renderElement({ value: '$data#/active' }, { active: false });
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders the element label', () => {
        renderElement({ value: '$data#/name', label: 'Full Name', type: 'text' }, { name: 'Bob' });
        expect(screen.getByText('Full Name')).toBeInTheDocument();
    });

    it('renders an auto-generated label key when no label is set', () => {
        renderElement({ value: '$data#/name', type: 'text' }, { name: 'Bob' });
        // auto key: screens.test-screen.name (screen id + path)
        expect(screen.getByText('screens.test-screen.name')).toBeInTheDocument();
    });

    it('renders a select as a text input showing the matching option label', () => {
        const element: ElementDefinition = {
            value: '$data#/status',
            type: 'select',
            config: {
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ],
            },
        };
        renderElement(element, { status: 'active' });
        expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
    });

    it('renders a prose element as a span', () => {
        renderElement({ value: '$data#/note', type: 'prose' }, { note: 'Some note' });
        expect(screen.getByText('Some note')).toBeInTheDocument();
        expect(document.querySelector('input')).toBeNull();
    });
});
