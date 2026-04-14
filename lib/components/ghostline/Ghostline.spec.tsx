import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GhostLine from './Ghostline';

describe('GhostLine', () => {
    it('renders', () => {
        const { container } = render(<GhostLine />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders two nested divs', () => {
        const { container } = render(<GhostLine />);
        const outer = container.firstChild as HTMLElement;
        expect(outer.tagName).toBe('DIV');
        expect(outer.firstChild).not.toBeNull();
        expect((outer.firstChild as HTMLElement).tagName).toBe('DIV');
    });
});
