import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('ol/ol.css', () => ({}));
vi.mock('ol/proj', () => ({ fromLonLat: vi.fn((coords) => coords) }));
vi.mock('ol/style', () => ({
    Style: vi.fn(function () {}),
    Circle: vi.fn(function () {}),
    Fill: vi.fn(function () {}),
    Stroke: vi.fn(function () {}),
}));
vi.mock('ol/Feature', () => ({
    default: vi.fn(function (this: { setStyle: () => void }) {
        this.setStyle = vi.fn();
    }),
}));
vi.mock('ol/geom/Point', () => ({ default: vi.fn(function () {}) }));
vi.mock('ol/source/OSM', () => ({ default: vi.fn(function () {}) }));
vi.mock('ol/source/Vector', () => ({ default: vi.fn(function () {}) }));
vi.mock('ol/layer/Tile', () => ({ default: vi.fn(function () {}) }));
vi.mock('ol/layer/Vector', () => ({ default: vi.fn(function () {}) }));
vi.mock('ol/View', () => ({ default: vi.fn(function () {}) }));
vi.mock('ol/Map', () => ({
    default: vi.fn(function (this: { setTarget: () => void; getView: () => { setZoom: () => void } }) {
        this.setTarget = vi.fn();
        this.getView = vi.fn(function () { return { setZoom: vi.fn() }; });
    }),
}));

import MapBlockRenderer from './index';

describe('MapBlockRenderer', () => {

    it('renders a map container div for valid coordinates', () => {
        const { container } = render(
            <MapBlockRenderer block={{ type: 'map', value: { latitude: 52.37, longitude: 4.89 } }} />
        );
        expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('renders em dash when value is null', () => {
        render(<MapBlockRenderer block={{ type: 'map', value: null as never }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders em dash when latitude is missing', () => {
        render(<MapBlockRenderer block={{ type: 'map', value: { longitude: 4.89 } as never }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders em dash when longitude is missing', () => {
        render(<MapBlockRenderer block={{ type: 'map', value: { latitude: 52.37 } as never }} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('accepts an optional zoom config', () => {
        const { container } = render(
            <MapBlockRenderer block={{ type: 'map', value: { latitude: 52.37, longitude: 4.89 }, config: { zoom: 8 } }} />
        );
        expect(container.querySelector('div')).toBeInTheDocument();
    });

});
