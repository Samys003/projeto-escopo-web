import { Children } from "react";
import ParagraphMedium from "./Typography/ParagraphMedium";

function IconButton(props) {
    return (
        <button onClick={props.onClick} className={`flex gap-2 items-center bg-(--color-base) text-white p-2 rounded-md ${props.className}`}>
            {props.icon}
            <ParagraphMedium className="font-medium">{props.children}</ParagraphMedium>
        </button>
    )
}

export default IconButton;