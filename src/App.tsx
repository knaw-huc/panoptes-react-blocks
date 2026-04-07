import { Panoptes } from '@knaw-huc/panoptes-react';
import LabelBlockRenderer from '../lib/components/blocks/label';
import MarkdownBlockRenderer from '../lib/components/blocks/markdown';
import JsonBlockRenderer from '../lib/components/blocks/json';
import ToggleBlockRenderer from '../lib/components/blocks/toggle';

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
];

export default function App() {
    return (
        <Panoptes configuration={{}}>
            <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
                <h1 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Blocks — Example App</h1>
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
