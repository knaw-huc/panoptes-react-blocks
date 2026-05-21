import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ScreenActions from './ScreenActions';
import type { ActionDefinition, ScreenDefinition } from './schema';
import type { Block } from '@knaw-huc/panoptes-react';

vi.mock('@knaw-huc/panoptes-react', () => ({
    usePanoptes: vi.fn(() => ({})),
    BlockLoader: ({ block }: { block: Block }) => (
        <div data-testid={`action-${(block as { config: ActionDefinition }).config.id}`} />
    ),
}));

const baseScreen: ScreenDefinition = {
    id: 'test-screen',
    screenType: 'normal',
    actions: [],
    form: { rows: [] },
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

    it('renders one block per action', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            actions: [
                { id: 'save', activate: 'always', confirmation: { askConfirmation: 'never' }, block: { type: 'action-button', value: null } },
                { id: 'delete', activate: 'always', confirmation: { askConfirmation: 'always' }, block: { type: 'action-button', value: null } },
            ],
        };
        renderWithScreen(screenDef);
        expect(screen.getByTestId('action-save')).toBeInTheDocument();
        expect(screen.getByTestId('action-delete')).toBeInTheDocument();
    });

});
