import { useState } from "react";
import ParagraphMedium from "../../../components/Typography/ParagraphMedium";


function ComponentMenu({ currentTab, selectionMenu }) {

    return (
        <div className=" flex items-center justify-between">
            {currentTab.map((tab) => (
                <button key={tab.id}
                    onClick={() => selectionMenu(tab.id)}
                    className={`pl-3 pr-3 pb-1 pt-1 rounded-[18px] ${tab.active ? "bg-(--roxo-light) text-(--roxo-dark)" : "bg-(--cinza-200) text-(--cinza-700)"}`}>
                    <ParagraphMedium>{tab.nome}</ParagraphMedium>
                </button>
            ))}

        </div>
    )
}



export default ComponentMenu;