import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ScreenActions from './ScreenActions';
import type { ActionDefinition, ScreenDefinition } from './schema';

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

const noConfirmAction: ActionDefinition = {
    id: 'save',
    label: 'Save',
    activate: 'always',
    confirmation: { askConfirmation: 'never' },
    operation: { operationId: 'save-op', parameters: {} },
};

const confirmAction: ActionDefinition = {
    id: 'delete',
    label: 'Delete',
    activate: 'always',
    confirmation: {
        askConfirmation: 'always',
        labels: { title: 'Are you sure?', message: 'This cannot be undone.', ok: 'Yes', cancel: 'No' },
    },
    operation: { operationId: 'delete-op', parameters: {} },
};

function renderWithScreen(screenDef: ScreenDefinition = baseScreen) {
    return render(
        <ScreenProvider screenDefinition={screenDef} data={{}}>
            <ScreenActions />
        </ScreenProvider>
    );
}

describe('ScreenActions', () => {
    it('renders nothing when there are no actions', () => {
        const { container } = renderWithScreen();
        expect(container.firstChild).toBeNull();
    });

    it('renders a button for each action', () => {
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [noConfirmAction, confirmAction] };
        renderWithScreen(screenDef);
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('sets data-action-id on each button', () => {
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [noConfirmAction] };
        renderWithScreen(screenDef);
        expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('data-action-id', 'save');
    });

    it('falls back to auto-generated label key when label is absent', () => {
        const action: ActionDefinition = {
            id: 'export',
            activate: 'always',
            confirmation: { askConfirmation: 'never' },
            operation: { operationId: 'export-op', parameters: {} },
        };
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [action] };
        renderWithScreen(screenDef);
        expect(screen.getByRole('button', { name: 'screens.test-screen.actions.export' })).toBeInTheDocument();
    });

    it('does not show a confirmation dialog before the button is clicked', () => {
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [confirmAction] };
        renderWithScreen(screenDef);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows a confirmation dialog when askConfirmation is "always"', async () => {
        const user = userEvent.setup();
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [confirmAction] };
        renderWithScreen(screenDef);
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    });

    it('hides the confirmation dialog after clicking cancel', async () => {
        const user = userEvent.setup();
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [confirmAction] };
        renderWithScreen(screenDef);
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'No' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('hides the confirmation dialog after clicking confirm', async () => {
        const user = userEvent.setup();
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [confirmAction] };
        renderWithScreen(screenDef);
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'Yes' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('executes immediately (no dialog) when askConfirmation is "never"', async () => {
        const user = userEvent.setup();
        const screenDef: ScreenDefinition = { ...baseScreen, actions: [noConfirmAction] };
        renderWithScreen(screenDef);
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
