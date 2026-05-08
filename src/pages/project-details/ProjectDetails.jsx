import MobileHeader from "../../components/MobileHeader";
import IconButton from "../../components/IconButton";
import { SquarePen, FolderPlus } from "lucide-react";
import Title2 from "../../components/Typography/Title2";
import ParagraphMedium from "../../components/Typography/ParagraphMedium";
import ParagraphSmall from "../../components/Typography/ParagraphSmall"
import ComponentMenu from "./components/ComponentMenu";
import { useState } from "react";
import Documents from "./components/Documents";
import ButtonRegistrer from "./components/ButtonRegister";
import Register from "./components/Register";





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

    const exibirDocumento =
        [
            {
                id: 1,
                nome: "Requisitos",
                documentos: [
                    {
                        id: 1,
                        titulo: "Documento de Requisitos",
                        quantidade_versoes: 3,
                        ultima_alteracao: "2026-04-14"
                    },
                    {
                        id: 2,
                        titulo: "Documento de Requisitos",
                        quantidade_versoes: 3,
                        ultima_alteracao: "2026-04-14"
                    },
                    {
                        id: 3,
                        titulo: "Documento de Requisitos",
                        quantidade_versoes: 3,
                        ultima_alteracao: "2026-04-14"
                    }
                ]
            },

            {
                id: 2,
                nome: "RNF",
                documentos: [
                    {
                        id: 1,
                        titulo: "Documento de Requisitos",
                        quantidade_versoes: 3,
                        ultima_alteracao: "2026-04-14"
                    },
                    {
                        id: 2,
                        titulo: "Documento de Requisitos",
                        quantidade_versoes: 3,
                        ultima_alteracao: "2026-04-14"
                    },
                    {
                        id: 3,
                        titulo: "Documento de Requisitos",
                        quantidade_versoes: 3,
                        ultima_alteracao: "2026-04-14"
                    }
                ]
            }
        ]

    const registros = [

        {
            id: 1,
            titulo: "Registro de Reunião",
            conteudo: "Conteúdo do registro",
            atualizado_em: "2026-04-14T10:00:00Z",
            criado_em: "2026-05-14T10:00:00Z"
        },
        {
            id: 2,
            titulo: "Registro de Reunião 2",
            conteudo: "Conteúdo do registro",
            atualizado_em: "2026-05-11T10:00:00Z",
            criado_em: "2026-04-14T10:00:00Z"
        },
        {
            id: 3,
            titulo: "Registro de Reunião 3",
            conteudo: "Conteúdo do registro",
            atualizado_em: "2026-06-12T10:00:00Z",
            criado_em: "2026-03-14T10:00:00Z"
        }



    ]

    // const formatRegistros = registros.reduce((acc, registro) => {
    //     const data = new Date(registro.criado_em)
    //     const month = data.toLocaleDateString("pt-BR", {
    //         month: "long"
    //     })

    //     const mes = {
    //         id: data.getMonth() + 1,
    //         month: month,
    //         year: data.getFullYear()
    //     }

    //     if (!acc[mes.id]) {
    //         acc[mes.id] = []
    //     }

    //     acc[mes.id].push(registro)

    //     return acc

    // }, {})




    const [currentTab, setCurrentTab] = useState("Documentos")

    const tabs = [
        "Documentos",
        "Registros",
        "Reuniões"
    ]





    return (
        <div className="w-full">
            <MobileHeader />
            <div className="w-full flex flex-col p-4" >
                <div className="w-full flex items-center gap-2 ">
                    <Title2 className="text-2xl" >
                        {project.titulo}
                    </Title2>
                    <IconButton icon={<SquarePen />} />
                </div>
                <div className="w-full flex flex-col  gap-2">
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
                    <ComponentMenu currentTab={currentTab} setCurrentTab={setCurrentTab} tabs={tabs}></ComponentMenu>
                </div>
                {currentTab === "Documentos" && (
                    <div className="flex flex-col w-full items-center gap-4 pt-5 ">
                        <IconButton className="w-40 gap-2" icon={<FolderPlus />}>Nova Categoria</IconButton>
                        <Documents exibirDocumento={exibirDocumento} ></Documents>
                    </div>
                )}
                {currentTab === "Registros" && (
                    <div className="pt-4">
                        <ButtonRegistrer>+ Novo Registro</ButtonRegistrer>

                    </div>
                )}
                {currentTab === "Reuniões" && (
                    <div></div>
                )}

            </div >
        </div >
    )
}




export default ProjectDetails;