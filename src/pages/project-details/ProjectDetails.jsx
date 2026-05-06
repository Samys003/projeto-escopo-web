import MobileHeader from "../../components/MobileHeader";
import IconButton from "../../components/IconButton";
import { SquarePen } from "lucide-react";
import Title2 from "../../components/Typography/Title2";
import ParagraphMedium from "../../components/Typography/ParagraphMedium";
import MenuButton from "../components/MenuButton";
import ComponentMenu from "./components/ComponentMenu";
import { useState } from "react";





function ProjectDetails() {
    const project = {

        id: 1,
        titulo: "Meu Projeto",
        descricao: "Descrição do projeto",
        status: true,
        data_criacao: "2026-04-14T10:00:00Z",
        ultima_atualizacao: "2026-04-14T12:00:00Z",
        nome_responsavel: "Nathan"

    }

    const documentos =
        [
            {
                "id": 1,
                "nome": "Requisitos",
                "documentos": [
                    {
                        "id": 1,
                        "titulo": "Documento de Requisitos",
                        "quantidade_versoes": 3,
                        "ultima_alteracao": "2026-04-14"
                    },
                    {
                        "id": 2,
                        "titulo": "Documento de Requisitos",
                        "quantidade_versoes": 3,
                        "ultima_alteracao": "2026-04-14"
                    },
                    {
                        "id": 3,
                        "titulo": "Documento de Requisitos",
                        "quantidade_versoes": 3,
                        "ultima_alteracao": "2026-04-14"
                    }
                ]
            }
        ]

    const [currentTab, setCurrentTab] = useState([

        {
            id: 1,
            nome: "Documentos",
            active: true
        },
        {
            id: 2,
            nome: "Registros",
            active: false
        },
        {
            id: 3,
            nome: "Reuniões",
            active: false
        },


    ])

    function selectionMenu(selectionId) {
        const selection = currentTab.map((tab) => {
            return {
                ...tab,
                active: tab.id === selectionId

            }
        })
        setCurrentTab(selection)
    }


    return (
        <div className="w-full">
            <MobileHeader />
            <div className="w-full flex items-center gap-2 pl-2.5 pt-2">
                <Title2 className="text-2xl" >
                    {project.titulo}
                </Title2>
                <button>
                    <IconButton icon={<SquarePen />} />
                </button>
            </div>
            <div className="w-full flex flex-col  gap-2 p-4 ">
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
                <ComponentMenu currentTab={currentTab} selectionMenu={selectionMenu}></ComponentMenu>
            </div>
        </div>
    )
}

export default ProjectDetails;