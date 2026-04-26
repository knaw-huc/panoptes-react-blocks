import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ScreenLinks from './ScreenLinks';
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

function renderWithScreen(screenDef: ScreenDefinition = baseScreen) {
    return render(
        <ScreenProvider screenDefinition={screenDef} data={{}}>
            <ScreenLinks />
        </ScreenProvider>
    );
}

describe('ScreenLinks', () => {
    it('renders nothing when there are no links', () => {
        const { container } = renderWithScreen();
        expect(container.firstChild).toBeNull();
    });

    it('renders a button for each link', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            links: [
                { id: 'home', label: 'Home' },
                { id: 'back', label: 'Back' },
            ],
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });

    it('uses the translated label for each link', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            links: [{ id: 'overview', label: 'screens.overview' }],
        };
        renderWithScreen(screenDef);
        // translateFn is identity, so the key itself is shown
        expect(screen.getByRole('button', { name: 'screens.overview' })).toBeInTheDocument();
    });

    it('sets data-link-id on each button', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            links: [{ id: 'my-link', label: 'My Link' }],
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('button', { name: 'My Link' })).toHaveAttribute('data-link-id', 'my-link');
    });

    it('clicking a link button does not throw', async () => {
        const user = userEvent.setup();
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            links: [{ id: 'nav', label: 'Nav', href: '/somewhere' }],
        };
        renderWithScreen(screenDef);
        await user.click(screen.getByRole('button', { name: 'Nav' }));
    });
});
