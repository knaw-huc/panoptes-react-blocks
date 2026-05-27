import {useContext} from "react";
import ActionContext, {type ActionContextValue} from "../context/ActionContext.tsx";

export default function useActionContext(): ActionContextValue {
    const context = useContext(ActionContext);
    if (!context) {
        throw new Error('useActionContext must be used within an action block rendered by ScreenActions');
    }
    return context;
}
