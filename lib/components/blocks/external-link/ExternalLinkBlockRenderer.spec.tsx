import {describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import ExternalLinkBlockRenderer from "./index.tsx";

describe('ExternalLinkBlockRenderer', () => {

    it('renders the external link', () => {
        render(<ExternalLinkBlockRenderer block={{ type: 'external-link', value: 'https://example.org' }} />);
        expect(screen.getByText('https://example.org')).toBeInTheDocument();
    });

    it('renders an em dash when value is empty', () => {
        render(<ExternalLinkBlockRenderer block={{ type: 'external-link', value: '' }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

});
