import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToggleBlockRenderer from './index';
import { usePanoptes, type PanoptesConfiguration } from '@knaw-huc/panoptes-react';

vi.mock('@knaw-huc/panoptes-react', () => ({
    usePanoptes: vi.fn(() => ({ translateFn: (key: string) => key })),
}));

vi.mock('@heroicons/react/24/solid', () => ({
    CheckIcon: ({ title }: { title: string }) => <svg role="img" aria-label={title} />,
    XMarkIcon: ({ title }: { title: string }) => <svg role="img" aria-label={title} />,
}));

describe('ToggleBlockRenderer', () => {
    it('renders a check icon when value is true', () => {
        render(<ToggleBlockRenderer block={{ type: 'toggle', value: true }} />);
        expect(screen.getByRole('img', { name: 'panoptes.yes' })).toBeInTheDocument();
    });

    it('renders a cross icon when value is false', () => {
        render(<ToggleBlockRenderer block={{ type: 'toggle', value: false }} />);
        expect(screen.getByRole('img', { name: 'panoptes.no' })).toBeInTheDocument();
    });

    it('renders em dash when value is null', () => {
        render(<ToggleBlockRenderer block={{ type: 'toggle', value: null as never }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders em dash when value is undefined', () => {
        render(<ToggleBlockRenderer block={{ type: 'toggle', value: undefined as never }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('uses the fallback "Yes" label when translateFn is absent', () => {
        vi.mocked(usePanoptes).mockReturnValueOnce({ translateFn: undefined } as PanoptesConfiguration);
        render(<ToggleBlockRenderer block={{ type: 'toggle', value: true }} />);
        expect(screen.getByRole('img', { name: 'Yes' })).toBeInTheDocument();
    });

    it('uses the fallback "No" label when translateFn is absent', () => {
        vi.mocked(usePanoptes).mockReturnValueOnce({ translateFn: undefined } as PanoptesConfiguration);
        render(<ToggleBlockRenderer block={{ type: 'toggle', value: false }} />);
        expect(screen.getByRole('img', { name: 'No' })).toBeInTheDocument();
    });
});
