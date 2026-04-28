import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ScreenTabs from './ScreenTabs';
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
            <ScreenTabs />
        </ScreenProvider>
    );
}

describe('ScreenTabs', () => {
    it('renders nothing when there are no tabs', () => {
        const { container } = renderWithScreen();
        expect(container.firstChild).toBeNull();
    });

    it('renders nothing when there is only one tab', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [{ id: 'only', label: 'Only Tab' }],
        };
        const { container } = renderWithScreen(screenDef);
        expect(container.firstChild).toBeNull();
    });

    it('renders a tablist when there are two or more tabs', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [
                { id: 'tab-a', label: 'Tab A' },
                { id: 'tab-b', label: 'Tab B' },
            ],
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Tab A' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Tab B' })).toBeInTheDocument();
    });

    it('marks the first tab as active by default', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [
                { id: 'tab-a', label: 'Tab A' },
                { id: 'tab-b', label: 'Tab B' },
            ],
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false');
    });

    it('marks the activeTabId tab as active when specified', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            activeTabId: 'tab-b',
            tabs: [
                { id: 'tab-a', label: 'Tab A' },
                { id: 'tab-b', label: 'Tab B' },
            ],
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false');
    });

    it('switches the active tab on click', async () => {
        const user = userEvent.setup();
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [
                { id: 'tab-a', label: 'Tab A' },
                { id: 'tab-b', label: 'Tab B' },
            ],
        };
        renderWithScreen(screenDef);
        await user.click(screen.getByRole('tab', { name: 'Tab B' }));
        expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false');
    });

    it('falls back to auto-generated label key when label is absent', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [
                { id: 'details' },
                { id: 'history' },
            ],
        };
        renderWithScreen(screenDef);
        // translateFn is identity, so the auto-key itself is rendered
        expect(screen.getByRole('tab', { name: 'screens.test-screen.tabs.details' })).toBeInTheDocument();
    });
});
