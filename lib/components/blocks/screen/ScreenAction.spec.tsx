import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ActionBlockRenderer from './ScreenAction';
import type { ActionDefinition, ScreenDefinition } from './schema';
import { useActionContext } from './context/ActionContext';
import type { Block } from '@knaw-huc/panoptes-react';

function MockBlock() {
    const { label, isEnabled, isExecuting, execute } = useActionContext();
    return (
        <button
            disabled={!isEnabled || isExecuting}
            onClick={() => execute(async () => {})}
        >
            {label}
        </button>
    );
}

vi.mock('@knaw-huc/panoptes-react', () => ({
    usePanoptes: vi.fn(() => ({ translateFn: (key: string) => key })),
    BlockLoader: MockBlock,
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
    block: { type: 'action-button', value: null },
};

const confirmAction: ActionDefinition = {
    id: 'delete',
    label: 'Delete',
    activate: 'always',
    confirmation: {
        askConfirmation: 'always',
        labels: { title: 'Are you sure?', message: 'This cannot be undone.', ok: 'Yes', cancel: 'No' },
    },
    block: { type: 'action-button', value: null },
};

function renderAction(action: ActionDefinition, screenDef: ScreenDefinition = baseScreen) {
    const block: Block = { type: 'action', value: null, config: action };
    return render(
        <ScreenProvider screenDefinition={screenDef} data={{}}>
            <ActionBlockRenderer block={block} />
        </ScreenProvider>
    );
}

describe('ActionBlockRenderer', () => {
    it('sets data-action-id on the wrapper', () => {
        const { container } = renderAction(noConfirmAction);
        expect(container.querySelector('[data-action-id="save"]')).toBeInTheDocument();
    });

    it('passes label to the block via ActionContext', () => {
        renderAction(noConfirmAction);
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('uses auto-generated label key when label is absent', () => {
        const action: ActionDefinition = {
            id: 'export',
            activate: 'always',
            confirmation: { askConfirmation: 'never' },
            block: { type: 'action-button', value: null },
        };
        renderAction(action);
        expect(screen.getByRole('button', { name: 'screens.test-screen.actions.export' })).toBeInTheDocument();
    });

    it('does not show a confirmation dialog before the button is clicked', () => {
        renderAction(confirmAction);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows a confirmation dialog when askConfirmation is "always"', async () => {
        const user = userEvent.setup();
        renderAction(confirmAction);
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    });

    it('hides the confirmation dialog after clicking cancel', async () => {
        const user = userEvent.setup();
        renderAction(confirmAction);
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'No' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('hides the confirmation dialog after clicking confirm', async () => {
        const user = userEvent.setup();
        renderAction(confirmAction);
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'Yes' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('executes immediately (no dialog) when askConfirmation is "never"', async () => {
        const user = userEvent.setup();
        renderAction(noConfirmAction);
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
