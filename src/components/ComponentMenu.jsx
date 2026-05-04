import { useState } from "react";
import ParagraphMedium from "./Typography/ParagraphMedium";


function ComponentMenu(props) {

    return (
        <button onClick="" className="bg-(--roxo-light) text-(--roxo-dark) pl-4 pr-4 pb-1 pt-1 rounded-[18px]">
            <ParagraphMedium>{props.currentTab[0]}</ParagraphMedium>
        </button>
    )
}



export default ComponentMenu;