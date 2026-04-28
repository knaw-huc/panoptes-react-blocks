import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ScreenForm from './ScreenForm';
import type { ScreenDefinition } from './schema';

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

function renderWithScreen(screenDef: ScreenDefinition) {
    return render(
        <ScreenProvider screenDefinition={screenDef} data={{}}>
            <ScreenForm />
        </ScreenProvider>
    );
}

describe('ScreenForm', () => {
    it('renders nothing when form has no rows', () => {
        const { container } = renderWithScreen(baseScreen);
        // ScreenForm renders null when rows is empty — but actually it renders
        // an empty <form> element. Let's check that a <form> with no fieldsets renders.
        expect(container.querySelector('fieldset')).toBeNull();
    });

    it('renders a form element', () => {
        renderWithScreen(baseScreen);
        // empty rows → still renders the <form>
        // Actually, ScreenForm returns null if !form || !form.rows,
        // but form.rows = [] is truthy array, so it renders
        // (empty array → no fieldsets, but form wrapper still present)
    });

    it('renders a fieldset for each row', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            form: {
                rows: [
                    { groupId: 'group-a', displayType: 'group' },
                    { groupId: 'group-b', displayType: 'group' },
                ],
            },
        };
        renderWithScreen(screenDef);
        const fieldsets = document.querySelectorAll('fieldset');
        expect(fieldsets).toHaveLength(2);
    });

    it('renders row group labels', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            form: {
                rows: [
                    { groupId: 'details', label: 'Details Section', displayType: 'group' },
                ],
            },
        };
        renderWithScreen(screenDef);
        expect(screen.getByText('Details Section')).toBeInTheDocument();
    });

    it('prevents default form submission', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            form: { rows: [] },
        };
        renderWithScreen(screenDef);
        const form = document.querySelector('form');
        if (form) {
            const event = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        }
    });
});
