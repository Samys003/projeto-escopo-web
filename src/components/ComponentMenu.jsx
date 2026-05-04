import { useState } from "react";
import ParagraphMedium from "./Typography/ParagraphMedium";


function ComponentMenu(props) {
    const [active, setActive] = useState("Documentos")

    const items = [
        { id: "documentos", label: "Documentos" },
        { id: "reunioes", label: "Reuniões" },
        { id: "registros", label: "Registros" }
    ]



    return (
        <div> {items.map((item) =>
        (
            <button onClick={() => setActive(item.id)} className="bg-(--roxo-light) text-(--roxo-dark) pl-4 pr-4 pb-1 pt-1 rounded-[18px]">
                <ParagraphMedium
                    key={item.id}
                    label={item.label}
                    active={active === item.id}
                />
            </button>
        ))}

        </div>
    )
}


export default ComponentMenu;