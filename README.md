# @knaw-huc/panoptes-react-blocks (Heavily WIP still!)

A React component library providing block renderers and a screen layout system for [Panoptes](https://github.com/knaw-huc/panoptes-react) applications.

## Installation

```bash
npm install @knaw-huc/panoptes-react-blocks
```

Import the styles in your app entry point:

```ts
import '@knaw-huc/panoptes-react-blocks/style.css';
```

## Peer dependencies

| Package | Version |
|---|---|
| `react` | 19 |
| `react-dom` | 19 |
| `@knaw-huc/panoptes-react` | `*` |
| `@tanstack/react-router` | `*` |

## Block renderers

Each renderer accepts a `block` prop typed as `Block` from `@knaw-huc/panoptes-react`. The block's `type`, `value`, and optional `config` fields drive the rendering.

### `ExternalLinkBlockRenderer`

Renders a `value` string as an external anchor (`target="_blank"`).

```ts
interface ExternalLinkBlock extends Block {
    type: 'link';
    value: string; // URL
}
```

### `LabelBlockRenderer`

Renders a plain text `value`.

```ts
interface LabelBlock extends Block {
    type: 'label';
    value: string;
}
```

### `LinkBlockRenderer`

Renders an internal navigation link using `@tanstack/react-router`. The URL is built from `config.url` and optional route `model` params.

```ts
interface LinkBlock extends Block {
    type: 'link';
    value: string;           // link text
    config?: { url: string }; // router path
    model?: Record<string, unknown>; // route params
}
```

### `MarkdownBlockRenderer`

Renders `value` as Markdown (GFM + raw HTML). HTML is sanitized via `rehype-sanitize`.

```ts
interface MarkDownBlock extends Block {
    type: 'markdown';
    value: string;
}
```

### `ToggleBlockRenderer`

Renders a boolean `value` as a check or cross icon (using Heroicons). Supports i18n via the Panoptes `translateFn`.

```ts
interface ToggleBlock extends Block {
    type: 'toggle';
    value: boolean;
}
```

### `MapBlockRenderer`

Renders an OpenLayers map centred on a lat/lon coordinate with a marker. Defaults to OpenStreetMap tiles.

```ts
interface MapBlock extends Block {
    type: 'map';
    value: { latitude: number; longitude: number };
    config?: {
        zoom?: number;    // default 12
        tileUrl?: string; // custom OSM-compatible tile URL
    };
}
```

### `RenderJsonBlock`

Renders structured JSON data driven by a JSON Schema `config`.

```ts
interface JsonBlock extends Block {
    type: 'json';
    value: JsonData;   // any JSON value
    config: JsonSchema; // JSON Schema object
}
```

### `RenderScreenBlock`

Renders a full data-entry screen defined by a `ScreenDefinition` config. See the [Screen system](#screen-system) section below.

```ts
interface ScreenBlock extends Block {
    type: 'screen';
    value: ScreenBlockValue; // Record<string, unknown>
    config: ScreenDefinition;
}
```

## Screen system

The screen system renders configurable forms with tabs, links, action buttons, and an optional sidebar. It is composed of:

- **`RenderScreenBlock`** — top-level entry point; wraps `ScreenProvider` + `ScreenRenderer`.
- **`ScreenProvider`** — React context provider; can be used standalone when you want to compose the renderer yourself.

```tsx
import { ScreenProvider, RenderScreenBlock } from '@knaw-huc/panoptes-react-blocks';
```

### `ScreenDefinition`

```ts
interface ScreenDefinition {
    id: string;
    label?: string;           // i18n key; defaults to `screens.{id}`
    screenType: 'normal';
    activeTabId?: string;
    tabs?: TabDefinition[];
    links?: LinkDefinition[];
    actions: ActionDefinition[];
    form: FormDefinition;
    sidebar?: SidebarDefinition;
}
```

### Tabs

```ts
interface TabDefinition {
    id: string;
    label?: string;
    operation?: OperationDefinition;
    operationList?: OperationListItem[];
}
```

Tabs are shown when two or more are defined. Each tab can carry an `operation` or a list of operations (`operationList`).

### Form

```ts
interface FormDefinition {
    rows: RowDefinition[];
}

interface RowDefinition {
    displayType?: 'header' | 'group' | 'footer' | 'row';
    label?: string;
    groupId?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    elements?: ElementDefinition[];
    columns?: ColumnDefinition[];
    rows?: RowDefinition[]; // nested rows
}

interface ElementDefinition {
    value: string | string[] | Record<string, string>; // binding expression or literal
    hidden?: boolean;
    addIndeterminate?: boolean;
    label?: string;
    infoLabel?: string;
    type?: string;
    config?: Record<string, unknown>;
}
```

### Data bindings

Element values support binding expressions that resolve against the screen's `value` data:

| Expression | Resolves from |
|---|---|
| `$data#/path/to/field` | top-level screen data |
| `$itemData#/path/to/field` | item-scoped data |

```ts
import { isBindingExpression, parseBinding, getNestedValue } from '@knaw-huc/panoptes-react-blocks';

const binding = parseBinding('$data#/author/name');
// { source: 'data', path: ['author', 'name'], rawPath: 'author/name' }

const value = getNestedValue(screenData, binding.path);
```

### Actions

```ts
interface ActionDefinition {
    id: string;
    label?: string;
    activate: 'always' | 'onDirty' | 'onValid' | 'onDirtyAndValid';
    confirmation: ConfirmationDefinition;
    operation: OperationDefinition;
}

interface ConfirmationDefinition {
    askConfirmation: 'always' | 'never' | 'onDirty';
    labels?: {
        title?: string;
        message?: string;
        ok?: string;
        cancel?: string;
    };
}
```

### Sidebar

```ts
interface SidebarDefinition {
    id: string;
    width?: string; // CSS value, e.g. '240px'
    sections: SidebarSectionDefinition[];
}

interface SidebarSectionDefinition {
    id: string;
    items: SidebarNavItemDefinition[];
}

interface SidebarNavItemDefinition {
    id: string;
    icon: string;
    label?: string;
    operation: OperationDefinition;
    active?: boolean;
}
```

## Utility components

### `GhostLine`

A decorative horizontal line placeholder used for loading states.

```tsx
import { GhostLine } from '@knaw-huc/panoptes-react-blocks';

<GhostLine />
```

## Building

```bash
npm run build   # compile once
npm run dev     # watch mode
```

Output is written to `dist/` as ES module (`index.js`) and CommonJS (`index.cjs`) bundles, with a bundled `style.css`.
