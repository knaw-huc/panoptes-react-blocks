import {type Block, useResolveResource} from "@knaw-huc/panoptes-react";
import classes from "./FilePreviewBlockRenderer.module.css";
import {ErrorBoundary} from "react-error-boundary";
import {Suspense} from "react";

export interface FilePreviewBlockData {
    contentType: string;
    url: string;
}

export interface FilePreviewBlock extends Block {
    type: 'file-preview';
    value: FilePreviewBlockData;
}

const FilePreview = ({ block }: { block: Block }) => {
    const filePreviewBlock = block as FilePreviewBlock;
    const { data } = useResolveResource(filePreviewBlock.value.url);

    return (
        <img
            className="aspect-auto w-40 h-20 rounded-lg"
            src={data.url}
            alt=""
        />
    );
}

const Fallback = () => <span className={classes.empty}>—</span>;

export default function FilePreviewBlockRenderer({ block }: { block: Block }) {
    return (
        <ErrorBoundary fallback={<Fallback />}>
            <Suspense fallback={<Fallback />}>
                <FilePreview block={block} />
            </Suspense>
        </ErrorBoundary>
    );
}
