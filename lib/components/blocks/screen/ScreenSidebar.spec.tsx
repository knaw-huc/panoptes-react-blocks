import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScreenProvider } from './context/ScreenContext';
import ScreenSidebar from './ScreenSidebar';
import type { ScreenDefinition, SidebarDefinition } from './schema';

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

function renderSidebar(sidebar: SidebarDefinition, screenDef: ScreenDefinition = baseScreen) {
    return render(
        <ScreenProvider screenDefinition={screenDef} data={{}}>
            <ScreenSidebar sidebar={sidebar} />
        </ScreenProvider>
    );
}

const sampleSidebar: SidebarDefinition = {
    id: 'main-sidebar',
    sections: [
        {
            id: 'section-a',
            items: [
                { id: 'item-1', icon: 'icon-a', label: 'Item One', operation: { operationId: 'op1', parameters: {} } },
                { id: 'item-2', icon: 'icon-b', label: 'Item Two', operation: { operationId: 'op2', parameters: {} } },
            ],
        },
    ],
};

describe('ScreenSidebar', () => {
    it('renders an aside element with the correct sidebar id', () => {
        renderSidebar(sampleSidebar);
        expect(screen.getByRole('complementary')).toHaveAttribute('data-sidebar-id', 'main-sidebar');
    });

    it('renders a button for each nav item', () => {
        renderSidebar(sampleSidebar);
        expect(screen.getByRole('button', { name: /Item One/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Item Two/ })).toBeInTheDocument();
    });

    it('uses auto-generated label key when label is absent', () => {
        const sidebar: SidebarDefinition = {
            id: 'sb',
            sections: [
                {
                    id: 'sec',
                    items: [
                        { id: 'nav-item', icon: 'x', operation: { operationId: 'op', parameters: {} } },
                    ],
                },
            ],
        };
        renderSidebar(sidebar);
        // translateFn is identity → auto-key is shown as title
        expect(screen.getByTitle('screens.test-screen.sidebar.sec.nav-item')).toBeInTheDocument();
    });

    it('renders multiple sections', () => {
        const sidebar: SidebarDefinition = {
            id: 'multi',
            sections: [
                {
                    id: 'sec-1',
                    items: [{ id: 'a', icon: 'x', label: 'Alpha', operation: { operationId: 'op', parameters: {} } }],
                },
                {
                    id: 'sec-2',
                    items: [{ id: 'b', icon: 'y', label: 'Beta', operation: { operationId: 'op', parameters: {} } }],
                },
            ],
        };
        renderSidebar(sidebar);
        expect(screen.getByRole('button', { name: /Alpha/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Beta/ })).toBeInTheDocument();
    });
});
