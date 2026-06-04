import {type Block, useResolveResource} from "@knaw-huc/panoptes-react";
import classes from "./FilePreviewBlockRenderer.module.css";

export interface FilePreviewBlockData {
    contentType: string;
    url: string;
}

export interface FilePreviewBlock extends Block {
    type: 'file-preview';
    value: FilePreviewBlockData;
}

export default function FilePreviewBlockRenderer({block}: { block: Block }) {
    const filePreviewBlock = block as FilePreviewBlock;

    const signedUrl = useResolveResource(filePreviewBlock.value.url);
    if (signedUrl.isSuccess) {
        return (<img className={"aspect-auto w-40 h-20 rounded-lg"} src={signedUrl.data.url}/>);
    }

    return <span className={classes.empty}>—</span>;

}
