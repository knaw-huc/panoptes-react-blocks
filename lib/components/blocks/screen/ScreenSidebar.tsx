import type {SidebarDefinition, SidebarNavItemDefinition} from './schema';
import styles from './ScreenSidebar.module.css';
import {usePanoptes} from "@knaw-huc/panoptes-react";
import useScreenContext from "./hooks/useScreenContext.ts";

interface ScreenSidebarProps {
    sidebar: SidebarDefinition;
}

function NavItem({ item, screenId, sectionId }: { item: SidebarNavItemDefinition; screenId: string; sectionId: string }) {
    const { translateFn } = usePanoptes();

    const autoLabelKey = `screens.${screenId}.sidebar.${sectionId}.${item.id}`;
    const labelKey = item.label ?? autoLabelKey;
    const label = translateFn ? translateFn(labelKey) : labelKey;

    const className = `${styles.item}${item.active ? ` ${styles.itemActive}` : ''}`;

    // TODO - use icons or something similar
    return (
        <button type="button" className={className} title={label}>
            X
            <span className={styles.tooltip}>{label}</span>
        </button>
    );
}

export default function ScreenSidebar({ sidebar }: ScreenSidebarProps) {
    const { screenDefinition } = useScreenContext();

    return (
        <aside className={styles.sidebar} data-sidebar-id={sidebar.id}>
            {sidebar.sections.map((section, index) => (
                <div key={section.id} className={styles.section}>
                    {index > 0 && <hr className={styles.divider} />}
                    {section.items.map(item => (
                        <NavItem key={item.id} item={item} screenId={screenDefinition.id} sectionId={section.id} />
                    ))}
                </div>
            ))}
        </aside>
    );
}
