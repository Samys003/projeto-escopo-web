import { useState } from "react";
import ParagraphMedium from "./Typography/ParagraphMedium";


function ComponentMenu(props) {

    return (
        <div>{props.currentTab.map((tab, index) => {
            <button key={index} onClick={() => { }} className="bg-(--roxo-light) text-(--roxo-dark) pl-4 pr-4 pb-1 pt-1 rounded-[18px]">
                <ParagraphMedium>{tab.nome}</ParagraphMedium>
            </button>

        })}

        </div>
    )
}



export default ComponentMenu;