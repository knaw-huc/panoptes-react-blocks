import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ScreenRenderer from './ScreenRenderer';
import type { ScreenDefinition } from './schema';

vi.mock('@knaw-huc/panoptes-react', () => ({
    usePanoptes: vi.fn(() => ({ translateFn: (key: string) => key })),
    useBlock: vi.fn(() => null),
    BlockLoader: () => <div data-testid="mock-block" />,
}));

const baseScreen: ScreenDefinition = {
    id: 'test-screen',
    screenType: 'normal',
    actions: [],
    form: { rows: [] },
};

function renderWithScreen(screenDef: ScreenDefinition = baseScreen, data: Record<string, unknown> = {}) {
    return render(
        <ScreenProvider screenDefinition={screenDef} data={data}>
            <ScreenRenderer />
        </ScreenProvider>
    );
}

describe('ScreenRenderer', () => {
    it('renders a wrapper div with data-screen-id', () => {
        renderWithScreen();
        expect(document.querySelector('[data-screen-id="test-screen"]')).toBeInTheDocument();
    });

    it('renders the screen label as a heading', () => {
        const screenDef: ScreenDefinition = { ...baseScreen, label: 'My Screen' };
        renderWithScreen(screenDef);
        expect(screen.getByRole('heading', { level: 1, name: 'My Screen' })).toBeInTheDocument();
    });

    it('uses auto-generated label key when label is absent', () => {
        renderWithScreen();
        // auto key: screens.<id>
        expect(screen.getByRole('heading', { level: 1, name: 'screens.test-screen' })).toBeInTheDocument();
    });

    it('does not render a links nav when there are no links', () => {
        renderWithScreen();
        expect(document.querySelector('nav')).toBeNull();
    });

    it('renders a links nav when links are defined', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            links: [{ id: 'home', label: 'Home' }],
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    });

    it('does not render a tablist when there is only one tab', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [{ id: 'only' }],
        };
        renderWithScreen(screenDef);
        expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('renders a tablist when there are multiple tabs', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            tabs: [
                { id: 'tab-a', label: 'Tab A' },
                { id: 'tab-b', label: 'Tab B' },
            ],
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('does not render an actions footer when there are no actions', () => {
        renderWithScreen();
        expect(document.querySelector('footer')).toBeNull();
    });

    it('renders an actions footer when actions are defined', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            actions: [
                {
                    id: 'save',
                    label: 'Save',
                    activate: 'always',
                    confirmation: { askConfirmation: 'never' },
                    block: { type: 'action-button', value: null },
                },
            ],
        };
        renderWithScreen(screenDef);
        expect(document.querySelector('footer')).toBeInTheDocument();
        expect(screen.getByTestId('mock-block')).toBeInTheDocument();
    });

    it('does not render a sidebar when sidebar is absent', () => {
        renderWithScreen();
        expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    });

    it('renders a sidebar when sidebar is defined', () => {
        const screenDef: ScreenDefinition = {
            ...baseScreen,
            sidebar: {
                id: 'main',
                sections: [
                    {
                        id: 'nav',
                        items: [
                            { id: 'item-1', icon: 'x', label: 'Nav Item', operation: { operationId: 'op', parameters: {} } },
                        ],
                    },
                ],
            },
        };
        renderWithScreen(screenDef);
        expect(screen.getByRole('complementary')).toBeInTheDocument();
    });

    it('renders a main content area', () => {
        renderWithScreen();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});
