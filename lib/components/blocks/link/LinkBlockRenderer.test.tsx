import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LinkBlockRenderer from './index';

vi.mock('@tanstack/react-router', () => ({
    useRouter: () => ({
        buildLocation: ({ to }: { to: string }) => ({ href: to }),
    }),
}));

describe('LinkBlockRenderer', () => {

    it('renders an anchor with the correct text and href', () => {
        render(<LinkBlockRenderer block={{ type: 'link', value: 'Go here', config: { url: '/items/123' } }} />);
        const link = screen.getByRole('link', { name: 'Go here' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/items/123');
    });

    it('renders em dash when value is empty', () => {
        render(<LinkBlockRenderer block={{ type: 'link', value: '', config: { url: '/items' } }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders em dash when config is missing', () => {
        render(<LinkBlockRenderer block={{ type: 'link', value: 'Go here' }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders em dash when config.url is missing', () => {
        render(<LinkBlockRenderer block={{ type: 'link', value: 'Go here', config: {} as { url: string } }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

});
