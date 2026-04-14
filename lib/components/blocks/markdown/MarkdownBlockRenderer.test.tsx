import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarkdownBlockRenderer from './index';

describe('MarkdownBlockRenderer', () => {

    it('renders plain text content', () => {
        render(<MarkdownBlockRenderer block={{ type: 'markdown', value: 'Hello world' }} />);
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders em dash when value is empty', () => {
        render(<MarkdownBlockRenderer block={{ type: 'markdown', value: '' }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders bold text from markdown', async () => {
        render(<MarkdownBlockRenderer block={{ type: 'markdown', value: '**bold text**' }} />);
        expect(screen.getByText('bold text').tagName).toBe('STRONG');
    });

    it('renders a heading from markdown', () => {
        render(<MarkdownBlockRenderer block={{ type: 'markdown', value: '# My Heading' }} />);
        expect(screen.getByRole('heading', { level: 1, name: 'My Heading' })).toBeInTheDocument();
    });

    it('renders a link from markdown', async () => {
        render(<MarkdownBlockRenderer block={{ type: 'markdown', value: '[click me](https://example.com)' }} />);
        const link = screen.getByRole('link', { name: 'click me' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('applies the link CSS class to markdown links', () => {
        render(<MarkdownBlockRenderer block={{ type: 'markdown', value: '[click me](https://example.com)' }} />);
        const link = screen.getByRole('link', { name: 'click me' });
        expect(link.className).toContain('link');
    });

    it('renders a GFM table', () => {
        const table = '| A | B |\n| - | - |\n| 1 | 2 |';
        render(<MarkdownBlockRenderer block={{ type: 'markdown', value: table }} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

});
