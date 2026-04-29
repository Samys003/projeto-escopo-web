import MobileHeader from "../components/MobileHeader";
import IconButton from "../components/IconButton";
import { SquarePen } from "lucide-react";
import Title2 from "../components/Typography/Title2";
import ParagraphMedium from "../components/Typography/ParagraphMedium";

const [Project] = [
    {
    id: 1,
    titulo: "Meu Projeto",
    descricao: "Descrição do projeto",
    status: true,
    data_criacao: "2026-04-14T10:00:00Z",
    ultima_atualizacao: "2026-04-14T12:00:00Z",
    nome_responsavel: "Nathan"
    }
]



function ProjectDetails (props){
    return (
        <div>
        <MobileHeader/>
        <div className="flex gap-2 p-2">
        <Title2 className="text-2xl" >

        </Title2>
         <IconButton icon={<SquarePen/>}/>
         </div>
         <div className="p-2">
            <ParagraphMedium>Status:</ParagraphMedium>
         </div>
        </div>
    )
}

export default ProjectDetails;