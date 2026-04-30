import MobileHeader from "../components/MobileHeader";
import IconButton from "../components/IconButton";
import { SquarePen } from "lucide-react";
import Title2 from "../components/Typography/Title2";
import ParagraphMedium from "../components/Typography/ParagraphMedium";





function ProjectDetails (){
    const project = {
    
    id: 1,
    titulo: "Meu Projeto",
    descricao: "Descrição do projeto",
    status: true,
    data_criacao: "2026-04-14T10:00:00Z",
    ultima_atualizacao: "2026-04-14T12:00:00Z",
    nome_responsavel: "Nathan"
    
    }

    const documentos = {
        
    }

    return (
        <div>
        <MobileHeader/>
        <div className="flex items-center gap-2 p-2">
        <Title2 className="text-2xl" >
            {project.titulo}
        </Title2>
         <IconButton icon={<SquarePen/>}/>
         </div>
         <div className="flex flex-col p-2 gap-2">
            <div className="">
            <ParagraphMedium>Status: {project.status ? "Concluido" : "Em andamento"}</ParagraphMedium>
            </div>
            <div>
            <ParagraphMedium>Descrição: {project.descricao} </ParagraphMedium>
            </div>
            <div>
            <ParagraphMedium>Data de Criação: {new Date(project.data_criacao).toLocaleDateString()}</ParagraphMedium>
            <ParagraphMedium>Ultima Alteração: {new Date(project.ultima_atualizacao).toLocaleDateString()}</ParagraphMedium>
            <ParagraphMedium>Responsavel: {project.nome_responsavel}</ParagraphMedium>
            </div>
            <div>
                
            </div>
         </div>
        </div>
    )
}

export default ProjectDetails;