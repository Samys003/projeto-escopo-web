import MobileHeader from "../../components/MobileHeader";
import IconButton from "../../components/IconButton";
import { SquarePen, FolderPlus, ChevronUp, ChevronDown } from "lucide-react";
import Title2 from "../../components/Typography/Title2";
import ParagraphMedium from "../../components/Typography/ParagraphMedium";
import ComponentMenu from "./components/ComponentMenu";
import { useEffect, useState } from "react";
import Documents from "./components/Documents";
import ButtonRegistrer from "./components/ButtonRegister";
import Register from "./components/Register";
import Meeting from "./components/Meeting";
import PopUp from "./components/PopUp";
import { useParams } from "react-router-dom";
import { getProjectById, getProjectDocumentById } from "../../services/api";






function ProjectDetails() {

    const { id } = useParams()

    const [project, setProject] = useState(null)
    const [documentos, setDocumentos] = useState([])

    useEffect(() => {

        async function carregarProjeto() {

            try {

                const data = await getProjectById(id)
                const dataDoc = await getProjectDocumentById(id)


                setProject(data)
                setDocumentos(dataDoc)


            } catch (error) {
                console.error(error)
            }


        }


        carregarProjeto()

    }, [id])


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
        },
        {
            id: 4,
            titulo: "Registro de Reunião 4",
            conteudo: "Conteúdo do registro",
            atualizado_em: "2026-05-12T10:00:00Z",
            criado_em: "2026-04-14T10:00:00Z"
        }

    ]

    const formatRegistros = registros.reduce((acc, registro) => {

        const data = new Date(registro.criado_em)

        const ano = data.getFullYear()

        const mes = data.toLocaleDateString("pt-BR", {
            month: "long"
        })

        const mesFormatado =
            mes.charAt(0).toUpperCase() + mes.slice(1)

        //cria o ano
        if (!acc[ano]) {
            acc[ano] = {}
        }

        //cria o mes
        if (!acc[ano][mesFormatado]) {
            acc[ano][mesFormatado] = []
        }

        //adicionando os registros
        acc[ano][mesFormatado].push(registro)

        return acc

    }, {})

    const reunioes = [
        {
            "id": 1,
            "titulo": "Reunião de Planejamento",
            "criado_em": "2026-05-14T10:00:00Z",
            "foto_usuarios": [
                "https://ui-avatars.com/api/?name=Samara",
                "https://ui-avatars.com/api/?name=Samara"
            ]
        },
        {
            "id": 2,
            "titulo": "Reunião de Requisitos",
            "criado_em": "2026-03-14T10:00:00Z",
            "foto_usuarios": [
                "https://ui-avatars.com/api/?name=Samara",
                "https://ui-avatars.com/api/?name=Samara"
            ]
        },

        {
            "id": 3,
            "titulo": "Reunião de alinhamentos",
            "criado_em": "2026-04-14T10:00:00Z",
            "foto_usuarios": [
                "https://ui-avatars.com/api/?name=Samara",
                "https://ui-avatars.com/api/?name=Samara"
            ]
        },
        {
            "id": 4,
            "titulo": "Reunião de alinhamentos 2",
            "criado_em": "2026-04-14T10:00:00Z",
            "foto_usuarios": [
                "https://ui-avatars.com/api/?name=Samara",
                "https://ui-avatars.com/api/?name=Samara"
            ]
        },
    ]

    const formatReunioes = reunioes.reduce((acc, reuniao) => {

        const data = new Date(reuniao.criado_em)

        const ano = data.getFullYear()

        const mes = data.toLocaleDateString("pt-BR", {
            month: "long"
        })

        const mesFormatado =
            mes.charAt(0).toUpperCase() + mes.slice(1)

        //cria o ano
        if (!acc[ano]) {
            acc[ano] = {}
        }

        //cria o mes
        if (!acc[ano][mesFormatado]) {
            acc[ano][mesFormatado] = []
        }

        //adicionando os registros
        acc[ano][mesFormatado].push(reuniao)

        return acc

    }, {})


    const [currentTab, setCurrentTab] = useState("Documentos")

    const tabs = [
        "Documentos",
        "Registros",
        "Reuniões"
    ]




    const [openModal, setOpenModal] = useState(false)
    const [nomeCategoria, setNomeCategoria] = useState("")

    const [expand, setExpand] = useState(false)


    function novaCategoria() {



    }


    return (
        <div className="w-full">
            <MobileHeader />
            <div className=" relative w-full flex flex-col p-4" >
                <div className="w-full flex items-center gap-2 ">
                    <Title2 className="text-2xl" >
                        {project?.titulo}
                    </Title2>
                    <IconButton icon={<SquarePen />} />
                </div>
                <div className="w-full flex flex-col  gap-2">
                    <div className="">
                        <ParagraphMedium>Status: {project?.status ? "Concluido" : "Em andamento"}</ParagraphMedium>
                    </div>
                    <div className={` flex  ${!expand ? "items-end justify-between" : "flex-col gap-2"} `}>
                        <ParagraphMedium className={!expand ? "line-clamp-2" : ""} >Descrição: {project?.descricao}</ParagraphMedium>
                        {expand && (
                            <div className=" flex justify-between items-end w-full">
                                <div>
                                    <ParagraphMedium>Data de Criação: {new Date(project?.data_criacao).toLocaleDateString()}</ParagraphMedium>
                                    <ParagraphMedium>Ultima Alteração: {new Date(project?.ultima_atualizacao).toLocaleDateString()}</ParagraphMedium>
                                    <ParagraphMedium>Responsavel: {project?.nome_responsavel}</ParagraphMedium>
                                </div>
                                <button onClick={() => setExpand(false)}>
                                    <ChevronUp />
                                </button>
                            </div>
                        )}
                        {!expand &&
                            <button onClick={() => setExpand(true)}>
                                <ChevronDown />
                            </button>
                        }

                    </div>

                    <ComponentMenu currentTab={currentTab} setCurrentTab={setCurrentTab} tabs={tabs}></ComponentMenu>
                </div>
                {currentTab === "Documentos" && (
                    <div className="flex flex-col w-full items-center gap-4 pt-5 ">
                        <IconButton
                            onClick={() => setOpenModal(true)}
                            className="w-40 gap-2"
                            icon={<FolderPlus />}>Nova Categoria
                        </IconButton>
                        {openModal && (
                            <PopUp nomeCategoria={nomeCategoria} setNomeCategoria={setNomeCategoria} novaCategoria={novaCategoria} onClose={() => setOpenModal(false)} />
                        )}
                        <Documents documentos={documentos}></Documents>
                    </div>
                )}
                {currentTab === "Registros" && (
                    <div className="pt-4">
                        <ButtonRegistrer>+ Novo Registro</ButtonRegistrer>
                        <Register formatRegistros={formatRegistros}></Register>
                    </div>
                )}
                {currentTab === "Reuniões" && (
                    <div className="pt-4">
                        <ButtonRegistrer>+ Nova Reunião</ButtonRegistrer>
                        <Meeting formatReunioes={formatReunioes}></Meeting>
                    </div>
                )}

            </div >
        </div >
    )
}




export default ProjectDetails;