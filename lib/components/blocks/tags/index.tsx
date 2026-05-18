import type {Block} from "@knaw-huc/panoptes-react";
import blockClasses from "../Blocks.module.css";
import classes from "./Tags.module.css";

export interface TagsBlock extends Block {
    type: 'tags';
    value: string | string[];
}

export default function TagsBlockRenderer({block}: { block: Block }) {

    const { value } = block as TagsBlock;

    const tags = typeof value === 'string' ? [value] : value;

    if (!Array.isArray(tags) || tags.length === 0) {
        return <span className={blockClasses.empty}>—</span>;
    }

    return (
        <ul className={classes.tags}>
            {tags.map((tag, index) => (
                <li key={`${index}-${tag}`} className={classes.tag}>{tag}</li>
            ))}
        </ul>
    );

}