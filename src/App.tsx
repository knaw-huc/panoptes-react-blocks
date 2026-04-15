import { Panoptes } from '@knaw-huc/panoptes-react';
import {
    LabelBlockRenderer,
    MarkdownBlockRenderer,
    JsonBlockRenderer,
    ToggleBlockRenderer,
    LinkBlockRenderer,
    ExternalLinkBlockRenderer,
    MapBlockRenderer,
    ScreenBlockRenderer,
} from '../lib';
import type { ScreenDefinition } from '../lib';
import RenderScreenBlock from "../lib/components/blocks/screen";

const exampleScreenDefinition: ScreenDefinition = {
    id: 'person-detail',
    label: 'Jane Doe',
    screenType: 'normal',
    tabs: [],
    links: [],
    actions: [],
    form: {
        rows: [
            {
                displayType: 'group',
                groupId: 'personal',
                columns: [
                    {
                        elements: [
                            { type: 'label', value: '$data#/firstName' },
                            { type: 'label', value: '$data#/lastName' },
                            { type: 'label', value: '$data#/dateOfBirth' },
                        ],
                    },
                    {
                        elements: [
                            { type: 'label', value: '$data#/email' },
                            { type: 'label', value: '$data#/phone' },
                            { type: 'toggle', value: '$data#/active' },
                        ],
                    },
                ],
            },
            {
                displayType: 'group',
                groupId: 'address',
                collapsible: true,
                defaultCollapsed: false,
                elements: [
                    { type: 'label', value: '$data#/address/street' },
                    { type: 'label', value: '$data#/address/city' },
                    { type: 'label', value: '$data#/address/country' },
                ],
            },
            {
                displayType: 'group',
                groupId: 'notes',
                elements: [
                    { type: 'markdown', value: '$data#/bio' },
                ],
            }
        ],
    },
};

const exampleScreenData = {
    firstName: 'Jane',
    lastName: 'Doe',
    dateOfBirth: '1990-06-15',
    email: 'jane.doe@example.com',
    phone: '+31 6 12345678',
    active: true,
    address: {
        street: 'Keizersgracht 123',
        city: 'Amsterdam',
        country: 'Netherlands',
    },
    bio: 'Jane is a senior researcher at the institute.\nShe specialises in digital humanities and archival studies.',
};

const sections: { title: string; element: React.ReactNode }[] = [
    {
        title: 'LabelBlockRenderer',
        element: (
            <>
                <LabelBlockRenderer block={{ type: 'label', value: 'Hello, world!' }} />
                <br />
                <LabelBlockRenderer block={{ type: 'label', value: '' }} />
            </>
        ),
    },
    {
        title: 'MarkdownBlockRenderer',
        element: (
            <MarkdownBlockRenderer
                block={{
                    type: 'markdown',
                    value: '## Markdown\n\nThis is **bold** and _italic_ text with a [link](https://example.com).',
                }}
            />
        ),
    },
    {
        title: 'JsonBlockRenderer',
        element: (
            <JsonBlockRenderer
                block={{
                    type: 'json',
                    value: { name: 'Alice', age: 30, tags: ['admin', 'user'] },
                    config: {},
                }}
            />
        ),
    },
    {
        title: 'ToggleBlockRenderer',
        element: (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <ToggleBlockRenderer block={{ type: 'toggle', value: true }} />
                <ToggleBlockRenderer block={{ type: 'toggle', value: false }} />
            </div>
        ),
    },
    {
        title: 'ScreenBlockRenderer',
        element: (
            <RenderScreenBlock block={{ type: 'screen', value: exampleScreenData, config: exampleScreenDefinition }} />
        ),
    },
];

export default function App() {
    return (
        <Panoptes configuration={{
            blocks: new Map([
                ["json", JsonBlockRenderer],
                ["link", LinkBlockRenderer],
                ["external-link", ExternalLinkBlockRenderer],
                ["markdown", MarkdownBlockRenderer],
                ["toggle", ToggleBlockRenderer],
                ["screen", ScreenBlockRenderer],
                ["label", LabelBlockRenderer],
                ["map", MapBlockRenderer]
            ])
        }}>
            <div style={{ fontFamily: 'sans-serif', margin: '2rem auto', padding: '0 1rem' }}>
                <h1>Panoptes-React-Blocks — Examples</h1>
                {sections.map(({ title, element }) => (
                    <section key={title} style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1rem', color: '#555', marginBottom: '0.5rem' }}>{title}</h2>
                        <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: '1rem' }}>
                            {element}
                        </div>
                    </section>
                ))}
            </div>
        </Panoptes>
    );
}
