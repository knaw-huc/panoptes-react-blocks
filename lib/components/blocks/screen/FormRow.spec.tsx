import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import FormRow from './FormRow';
import type { RowDefinition, ScreenDefinition } from './schema';

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

function renderRow(row: RowDefinition, screenDef: ScreenDefinition = baseScreen) {
    return render(
        <ScreenProvider screenDefinition={screenDef} data={{}}>
            <FormRow row={row} />
        </ScreenProvider>
    );
}

describe('FormRow', () => {
    it('renders a fieldset', () => {
        renderRow({ displayType: 'row' });
        expect(document.querySelector('fieldset')).toBeInTheDocument();
    });

    it('sets data-group-id on the fieldset when groupId is provided', () => {
        renderRow({ groupId: 'my-group', displayType: 'group' });
        expect(document.querySelector('fieldset')).toHaveAttribute('data-group-id', 'my-group');
    });

    it('renders a legend when a label is provided', () => {
        renderRow({ label: 'Personal Info', displayType: 'group' });
        expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    it('uses an auto-generated label key based on groupId when no label is set', () => {
        renderRow({ groupId: 'contact', displayType: 'group' });
        // translateFn is identity → auto key is rendered
        expect(screen.getByText('screens.test-screen.contact')).toBeInTheDocument();
    });

    it('renders no legend when there is no label or groupId', () => {
        renderRow({ displayType: 'row' });
        expect(document.querySelector('legend')).toBeNull();
    });

    it('renders nested rows', () => {
        const row: RowDefinition = {
            displayType: 'group',
            label: 'Parent',
            rows: [
                { groupId: 'child-a', label: 'Child A', displayType: 'group' },
                { groupId: 'child-b', label: 'Child B', displayType: 'group' },
            ],
        };
        renderRow(row);
        expect(screen.getByText('Child A')).toBeInTheDocument();
        expect(screen.getByText('Child B')).toBeInTheDocument();
    });

    it('renders columns when no nested rows are present', () => {
        const row: RowDefinition = {
            displayType: 'row',
            columns: [
                { elements: [] },
                { elements: [] },
            ],
        };
        renderRow(row);
        // No error; column container div rendered
        expect(document.querySelector('fieldset')).toBeInTheDocument();
    });

    describe('collapsible group', () => {
        const collapsibleRow: RowDefinition = {
            displayType: 'group',
            label: 'Collapsible Section',
            collapsible: true,
            defaultCollapsed: false,
            groupId: 'collapsible',
        };

        it('renders a toggle button when the group is collapsible', () => {
            renderRow(collapsibleRow);
            expect(screen.getByRole('button', { name: /Collapsible Section/ })).toBeInTheDocument();
        });

        it('starts expanded when defaultCollapsed is false', () => {
            renderRow(collapsibleRow);
            expect(screen.getByRole('button', { name: /Collapsible Section/ })).toHaveAttribute('aria-expanded', 'true');
        });

        it('starts collapsed when defaultCollapsed is true', () => {
            renderRow({ ...collapsibleRow, defaultCollapsed: true });
            expect(screen.getByRole('button', { name: /Collapsible Section/ })).toHaveAttribute('aria-expanded', 'false');
        });

        it('toggles collapsed state when the button is clicked', async () => {
            const user = userEvent.setup();
            renderRow(collapsibleRow);
            const toggleBtn = screen.getByRole('button', { name: /Collapsible Section/ });
            await user.click(toggleBtn);
            expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
            await user.click(toggleBtn);
            expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
        });
    });
});
