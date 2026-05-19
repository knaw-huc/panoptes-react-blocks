import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {Panoptes} from "@knaw-huc/panoptes-react";
import {
    ExternalLinkBlockRenderer,
    LabelBlockRenderer,
    MarkdownBlockRenderer,
    JsonBlockRenderer,
    ToggleBlockRenderer,
    type ScreenDefinition,
    panoptesBlocksLibrary
} from "../lib";
import RenderScreenBlock from "../lib/components/blocks/screen";
import "./i18n/i18n.ts";
import {createTranslate} from "./i18n/i18n.ts";
import '@knaw-huc/panoptes-react/style.css';
import TagsBlockRenderer from "../lib/components/blocks/tags";

const exampleScreenDefinition: ScreenDefinition = {
    id: 'bypass-item-view',
    label: 'PAPA Amsterdam ZUID Collection',
    screenType: 'normal',
    tabs: [
        {
            id: 'file'
        },
        {
            id: 'file-history'
        },
        {
            id: 'metadata'
        },
        {
            id: 'related-files'
        }
    ],
    links: [],
    actions: [
        {
            id: 'save-changes',
            confirmation: {
                askConfirmation: 'never'
            },
            activate: 'always',
            operation: {
                operationId: 'saveItemChanges',
                parameters: { }
            }
        },
        {
            id: 'revert',
            confirmation: {
                askConfirmation: 'never'
            },
            activate: 'always',
            operation: {
                operationId: 'revertChanges',
                parameters: {}
            }
        },
        {
            id: 'download',
            confirmation: {
                askConfirmation: 'never'
            },
            activate: 'always',
            operation: {
                operationId: 'downloadItem',
                parameters: {}
            },
        },
        {
            id: 'export-metadata',
            confirmation: {
                askConfirmation: 'never'
            },
            activate: 'always',
            operation: {
                operationId: 'exportMetadata',
                parameters: {}
            }
        },
        {
            id: 'share',
            confirmation: {
                askConfirmation: 'never'
            },
            activate: 'always',
            operation: {
                operationId: 'share',
                parameters: {}
            }
        }
    ],
    form: {
        rows: [
            {
                displayType: 'group',
                groupId: 'file-information',
                elements: [
                    { type: 'label', value: '$data#$.title' },
                    { type: 'label', value: '$data#$.repository' },
                    { type: 'label', value: '$data#$.accessionDate' },
                    { type: 'list', value: '$data#$.relatedItems' },

                ]
            },
            {
                displayType: 'group',
                groupId: 'rights-and-access',
                collapsible: true,
                defaultCollapsed: false,
                elements: [
                    { type: 'label', value: '$data#$.copyrightStatus' },
                    { type: 'label', value: '$data#$.rightsHolder' },
                    { type: 'label', value: '$data#$.accessLevel' },
                    { type: 'label', value: '$data#$.usageRights' }
                ]
            },
            {
                displayType: 'group',
                groupId: 'geographic-information',
                rows: [
                    {
                        columns: [
                            {
                                "elements": [
                                    { type: 'label', value: '$data#$.coordinates.lat' },
                                ]
                            },
                            {
                                "elements": [
                                    { type: 'label', value: '$data#$.coordinates.lon' },
                                ]
                            },
                        ]
                    },
                    {
                        elements: [
                            {
                                type: "map",
                                value: {
                                    "latitude": "$data#$.coordinates.lat",
                                    "longitude": "$data#$.coordinates.lon"
                                },
                                config: {
                                    zoom: 6
                                }
                            }
                        ]
                    }
                ],
            },
            {
                displayType: 'group',
                groupId: 'technical-information',
                elements: [
                    { type: 'external-link', value: '$data#$.sourceOfFile' },
                    { type: 'label', value: '$data#$.inception' },
                    { type: 'label', value: '$data#$.mediaType' },
                    { type: 'label', value: '$data#$.checksum' },
                ],
            },
            {
                displayType: 'group',
                groupId: 'contributors',
                elements: [
                    {
                        type: 'array',
                        value: '$data#$.contributors',
                        config: {
                            itemTemplate: {
                                name: { type: 'label', value: '$itemData#$.name' },
                                role: { type: 'label', value: '$itemData#$.role' },
                            },
                        },
                    },
                ],
            }
        ],
    },
};

const manuscriptScreenDefinition: ScreenDefinition = {
    id: 'manuscript-details',
    label: 'Manuscript — Contents',
    screenType: 'normal',
    tabs: [],
    links: [],
    actions: [],
    form: {
        rows: [
            {
                displayType: 'group',
                groupId: 'contents',
                columns: [
                    {
                        elements: [
                            {
                                type: 'array',
                                value: '$data#$.Source.ManuscriptDescription.Contents.Item',
                                config: {
                                    itemTemplate: {
                                        rows: [
                                            {
                                                elements: [
                                                    { type: 'label', value: "$itemData#$.Title.title['`@value']" },
                                                    { type: 'label', value: "$itemData#$.Title.altTitle['`@value']" },
                                                ],
                                            },
                                            {
                                                elements: [
                                                    {
                                                        type: 'array',
                                                        value: '$itemData#$.Author',
                                                        config: {
                                                            itemTemplate: {
                                                                status: { type: 'label', value: "$itemData#$.authorStatus['`@value']" },
                                                                author: { type: 'label', value: "$itemData#$.author['`@value']" },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

const manuscriptScreenData = {
    Source: {
        ManuscriptDescription: {
            Contents: {
                Item: [
                    {
                        locusFrom: { '@value': '1r' },
                        locusTo: { '@value': '3v' },
                        Title: {
                            title: { '@value': 'De vita beata' },
                            altTitle: { '@value': 'On the Happy Life' },
                        },
                        Author: [
                            {
                                authorStatus: { '@value': 'attributed' },
                                author: { '@value': 'Seneca' },
                            },
                            {
                                authorStatus: { '@value': 'translator' },
                                author: { '@value': 'Anonymous' },
                            },
                        ],
                    },
                    {
                        locusFrom: { '@value': '4r' },
                        locusTo: { '@value': '12v' },
                        Title: {
                            title: { '@value': 'Epistulae morales' },
                            altTitle: { '@value': 'Moral Letters' },
                        },
                        Author: [
                            {
                                authorStatus: { '@value': 'certain' },
                                author: { '@value': 'Seneca' },
                            },
                        ],
                    },
                ],
            },
        },
    },
};

const exampleScreenData = {
    title: 'Beeldenkunst en literatuur',
    repository: 'IISG Digital Collections',
    accessionDate: '10/01/2024',
    relatedItems: [ 'Parkeergarage voor scooters' ],
    copyrightStatus: 'In copyright',
    rightsHolder: 'Lino Heilings',
    accessLevel: 'public',
    usageRights: 'Usage rights and restrictions',
    coordinates: {
        lat: 52.37302,
        lon: 4.89856
    },
    sourceOfFile: 'https://www.flickr.com/photos/iisg/5786243120',
    inception: '1 March 1948',
    mediaType: 'image/jpeg',
    checksum: '66fec03641e0596f9bfb339ffecf89c17d424836 (Determination method: SHA-1)',
    contributors: [
        { name: 'Lino Heilings', role: 'Photographer' },
        { name: 'IISG Archives', role: 'Repository' },
    ],
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
        title: 'TagsBlockRenderer',
        element: (
            <TagsBlockRenderer
                block={{
                    type: 'tags',
                    value: ['Amsterdam Zuid', 'beeldenkunst', 'literatuur', 'stedelijk', 'omslag', 'drukwerk'],
                }}
            />
        ),
    },
    {
        title: 'TagsBlockRenderer single value',
        element: (
            <TagsBlockRenderer
                block={{
                    type: 'tags',
                    value: 'Amsterdam Zuid'
                }}
            />
        ),
    },
    {
        title: 'ExternalLinkBlockRenderer',
        element: (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <ExternalLinkBlockRenderer block={{ type: 'external-link', value: 'http://www.google.com' }} />
            </div>
        ),
    },
    {
        title: 'ScreenBlockRenderer',
        element: (
            <RenderScreenBlock block={{ type: 'screen', value: exampleScreenData, config: exampleScreenDefinition }} />
        ),
    },
    {
        title: 'ScreenBlockRenderer — array itemTemplate with rows (nested array on its own row)',
        element: (
            <RenderScreenBlock block={{ type: 'screen', value: manuscriptScreenData, config: manuscriptScreenDefinition }} />
        ),
    }
];

function App() {
    return (
        <Panoptes configuration={{
            blocks: panoptesBlocksLibrary,
            translateFn: createTranslate()
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

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
