import { FolderPlus, Trash2 } from "lucide-react";
import IconButton from "../../../components/IconButton";
import ParagraphLarge from "../../../components/Typography/ParagraphLarge";
import Title2 from "../../../components/Typography/Title2";
import ParagraphMedium from "../../../components/Typography/ParagraphMedium";

function Documents({ exibirDocumento }) {
    return (
        <div className="w-full flex flex-col gap-3">
            {exibirDocumento.map((doc) => {
                return (
                    <div className=" w-full flex flex-col gap-1 ">
                        <div className="w-full flex justify-between">
                            <Title2 key={doc.id}>{doc.nome}</Title2>
                            <IconButton className="bg-transparent" icon={<Trash2 className="text-(--color-base)"></Trash2>}></IconButton>
                        </div>
                        <div className="border w-full flex flex-col p-10 items-center gap-2.5 rounded-lg border-(--cinza-300)">
                            {doc.documentos.slice(0, 2).map((subdoc) => {
                                return (
                                    <div className="flex justify-evenly w-full">
                                        <div className="">
                                            <ParagraphLarge>{subdoc.titulo}</ParagraphLarge>
                                            <ParagraphLarge className="text-(--cinza-500)">Ultima Alteração: {new Date(subdoc.ultima_alteracao).toLocaleDateString()}</ParagraphLarge>
                                        </div>
                                        <ParagraphMedium className="bg-(--cinza-400) rounded-sm p-1 w-6 h-6 flex items-center justify-center text-white">{subdoc.quantidade_versoes}</ParagraphMedium>
                                    </div>
                                )
                            })}
                            <IconButton className="gap-2" icon={<FolderPlus />}>Novo Documento</IconButton>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Documents;