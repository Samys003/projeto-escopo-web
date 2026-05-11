import IconButton from "../../../components/IconButton";
import ParagraphMedium from "../../../components/Typography/ParagraphMedium";
import Title4 from "../../../components/Typography/Title4";
import { X } from "lucide-react"

function PopUp({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="p-6 w-85.5 h-45 bg-white rounded-xl  ">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-between w-full">
                        <Title4 className="text-black w-full">Adicionar Categoria</Title4>
                        <button onClick={onClose} className="bg-amber-300">
                            <X className="text-black" />
                        </button>
                    </div>
                    <div className=" w-full h-full text-start">
                        <ParagraphMedium className="text-(--cinza-700)">Titulo da Categoria</ParagraphMedium>
                        <form>
                            <input type="text" className="border border-black w-73.5 p-1 h-8 rounded-xl text-(--cinza-600)" placeholder="Nova Categoria"></input>
                        </form>
                    </div>
                    <div className="flex items-end justify-end">
                        <IconButton>Criar</IconButton>
                    </div>
                </div>
            </div>


        </div>
    )

}


export default PopUp;