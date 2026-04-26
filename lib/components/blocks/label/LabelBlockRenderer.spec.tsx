import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LabelBlockRenderer from './index';

describe('LabelBlockRenderer', () => {

    it('renders the label value', () => {
        render(<LabelBlockRenderer block={{ type: 'label', value: 'Hello world' }} />);
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders an em dash when value is empty', () => {
        render(<LabelBlockRenderer block={{ type: 'label', value: '' }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

});
