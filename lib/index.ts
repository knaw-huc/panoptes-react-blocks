import React from "react";
import type {Block} from "@knaw-huc/panoptes-react";
import ActionBlockRenderer from './components/blocks/screen/ScreenAction.tsx';
import ExternalLinkBlockRenderer from './components/blocks/external-link';
import JsonBlockRenderer from './components/blocks/json';
import LabelBlockRenderer from './components/blocks/label';
import LinkBlockRenderer from './components/blocks/link';
import MapBlockRenderer from './components/blocks/map';
import MarkdownBlockRenderer from './components/blocks/markdown';
import ScreenBlockRenderer from './components/blocks/screen';
import ToggleBlockRenderer from './components/blocks/toggle';
import TagsBlockRenderer from "./components/blocks/tags";

export { default as ActionBlockRenderer } from './components/blocks/screen/ScreenAction.tsx';
export type { ActionBlock } from './components/blocks/screen/ScreenAction.tsx';

export { default as ExternalLinkBlockRenderer } from './components/blocks/external-link';
export type { ExternalLinkBlock } from './components/blocks/external-link';

export { default as JsonBlockRenderer } from './components/blocks/json';
export type { JsonBlock, JsonData, JsonSchema, JsonValue, JsonObject, JsonArray, JsonPrimitive } from './components/blocks/json';

export { default as LabelBlockRenderer } from './components/blocks/label';
export type { LabelBlock } from './components/blocks/label';

export { default as LinkBlockRenderer } from './components/blocks/link';
export type { LinkBlock, LinkBlockConfig } from './components/blocks/link';

export { default as MapBlockRenderer } from './components/blocks/map';
export type { MapBlock, MapBlockConfig, MapBlockValue } from './components/blocks/map';

export { default as MarkdownBlockRenderer } from './components/blocks/markdown';
export type { MarkDownBlock } from './components/blocks/markdown';

export { default as ScreenBlockRenderer } from './components/blocks/screen';
export { ScreenProvider } from './components/blocks/screen/context/ScreenContext';
export type { ScreenProviderProps } from './components/blocks/screen/context/ScreenContext';
export { default as useScreenContext } from './components/blocks/screen/hooks/useScreenContext';
export { useActionContext } from './components/blocks/screen/context/ActionContext';
export type { ActionContextValue } from './components/blocks/screen/context/ActionContext';

export { default as ToggleBlockRenderer } from './components/blocks/toggle';
export type { ToggleBlock } from './components/blocks/toggle';

export { default as TagsBlockRenderer } from './components/blocks/tags';
export type { TagsBlock } from './components/blocks/tags';

// Screen schema types
export type {
    ScreenDefinition,
    ScreenType,
    ScreenBlock,
    ScreenBlockValue,
    TabDefinition,
    OperationDefinition,
    LinkDefinition,
    ActionDefinition,
    ActivationType,
    ConfirmationDefinition,
    ConfirmationLabels,
    FormDefinition,
    RowDefinition,
    DisplayType,
    ColumnDefinition,
    ElementDefinition,
    SidebarDefinition,
    SidebarSectionDefinition,
    SidebarNavItemDefinition,
    ParsedBinding,
} from './components/blocks/screen/schema';

export {
    isBindingExpression,
    parseBinding,
    resolveBinding,
    bindingPathSegments,
} from './components/blocks/screen/schema';

export { default as GhostLine } from './components/ghostline/Ghostline';

export const panoptesBlocksLibrary = new Map([
    ['action', ActionBlockRenderer],
    ['external-link', ExternalLinkBlockRenderer],
    ['json', JsonBlockRenderer],
    ['label', LabelBlockRenderer],
    ['link', LinkBlockRenderer],
    ['map', MapBlockRenderer],
    ['markdown', MarkdownBlockRenderer],
    ['screen', ScreenBlockRenderer],
    ['toggle', ToggleBlockRenderer],
    ['tags', TagsBlockRenderer]
]) as Map<string, React.FC<{ block: Block }>>;
