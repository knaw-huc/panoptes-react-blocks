import { BlockLoader } from '@knaw-huc/panoptes-react';
import styles from './ScreenActions.module.css';
import { useScreenContext } from './hooks';

export default function ScreenActions() {

    const { screenDefinition } = useScreenContext();
    const { actions } = screenDefinition;

    if (!actions || actions.length === 0) {
        return null;
    }

    return (
        <div className={styles.actions}>
            {actions.map((action) => (
                <BlockLoader key={action.id} block={{ type: 'action', value: null, config: action }} />
            ))}
        </div>
    );

}
