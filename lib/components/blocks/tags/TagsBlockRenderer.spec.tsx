import {describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import TagsBlockRenderer from "./index.tsx";

describe('TagsBlockRenderer', () => {

    it('renders each string as a tag', () => {
        render(<TagsBlockRenderer block={{ type: 'tags', value: ['Amsterdam Zuid', 'beeldenkunst', 'literatuur'] }} />);
        expect(screen.getByText('Amsterdam Zuid')).toBeInTheDocument();
        expect(screen.getByText('beeldenkunst')).toBeInTheDocument();
        expect(screen.getByText('literatuur')).toBeInTheDocument();
    });

    it('renders a single string value as one tag', () => {
        render(<TagsBlockRenderer block={{ type: 'tags', value: 'Amsterdam Zuid' }} />);
        expect(screen.getByText('Amsterdam Zuid')).toBeInTheDocument();
    });

    it('renders an em dash when the array is empty', () => {
        render(<TagsBlockRenderer block={{ type: 'tags', value: [] }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders an em dash when value is not an array', () => {
        render(<TagsBlockRenderer block={{ type: 'tags', value: undefined as unknown as string[] }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

});