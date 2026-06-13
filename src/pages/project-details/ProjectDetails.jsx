import MobileHeader from '../../components/MobileHeader';
import IconButton from '../../components/IconButton';
import ComponentMenu from './components/ComponentMenu';
import { useEffect, useState } from 'react';
import Documents from './components/Documents';
import ButtonRegistrer from './components/ButtonRegister';
import Register from './components/Register';
import Meeting from './components/Meeting';
import PopUp from './components/PopUp';
import { useNavigate, useParams } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import {
    deleteCategoria,
    getMeetingById,
    getProjectById,
    getProjectDocumentById,
    getRegisterId,
    newCategoria,
    newDocument,
    newMeeting,
    newRegister,
} from '../../services/api.js';
import DesktopSidebar from '../../components/DesktopSidebar';
import DescriptionProjectMobile from './components/DescriptionProjectMobile';
import DescriptionProjectDesktop from './components/DescriptionProjectDesktop';
import documentosvazios from './assets/documentosvazios.svg';
import registrosvazios from './assets/registrosvazios.svg';
import reunioesvazios from './assets/reunioesvazios.svg';
import ParagraphSmall from '../../components/Typography/ParagraphSmall.jsx';
import ParagraphLarge from '../../components/Typography/ParagraphLarge.jsx';

function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [reunioes, setReunioes] = useState([]);
    const [currentTab, setCurrentTab] = useState(
        sessionStorage.getItem('projectTab') || 'Documentos',
    );
    const tabs = ['Documentos', 'Registros', 'Reuniões'];
    const [openModalCategoria, setOpenModalCategoria] = useState(false);
    const [openModalReuniao, setOpenModalReuniao] = useState(false);
    const [expand, setExpand] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [nomeReuniao, setNomeReuniao] = useState('');
    const [expandRegsister, setExpandRegister] = useState({});
    const [expandReuniao, setExpandReuniao] = useState({});
    const [openModalDeleteCategoria, setOpenModalDeleteCategoria] = useState(null);
    const [erro, setErro] = useState('');
    const [nomeDocument, setNomeDocument] = useState('');
    const [nomeRegistro, setNomeRegistro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarProjeto() {
            try {
                const data = await getProjectById(id);
                const dataDoc = await getProjectDocumentById(id);

                setProject(data);
                setDocumentos(dataDoc);
            } catch (error) {
                console.error(error);
            }
        }

        carregarProjeto();
    }, [id]);

    useEffect(() => {
        sessionStorage.setItem('projectTab', currentTab);
    }, [currentTab]);

    async function novaCategoria() {
        if (!nomeCategoria.trim()) {
            setErro('Esse campo não pode estar vazio! ');
            return;
        }

        setErro('');

        try {
            const nameCategoria = {
                titulo: nomeCategoria,
            };

            const data = await newCategoria(id, nameCategoria);
            const dataDoc = await getProjectDocumentById(id);

            setNomeCategoria(data);
            console.log(data);

            setDocumentos(dataDoc);

            setOpenModalCategoria(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function novaReuniao() {
        if (!nomeReuniao.trim()) {
            setErro('Esse campo não pode estar vazio! ');
            return;
        }

        setErro('');

        try {
            const nameMeeting = {
                titulo: nomeReuniao,
            };

            const data = await newMeeting(id, nameMeeting);
            const dataDoc = await getMeetingById(id);

            setNomeReuniao(data);

            setReunioes(dataDoc);

            navigate(`/reuniao/${data.id}`);

            setOpenModalReuniao(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function deletarCategoria(categoriaId) {
        try {
            await deleteCategoria(categoriaId);

            const dataDoc = await getProjectDocumentById(id);

            setDocumentos(dataDoc);

            setOpenModalDeleteCategoria(null);
        } catch (error) {
            console.log(error);
        }
    }

    async function novoDocumento(idCategoria) {
        try {
            const nameDocument = {
                titulo: 'Novo Documento',
            };

            const data = await newDocument(idCategoria, nameDocument);

            setNomeDocument(data);

            navigate(`/documento/${data.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    async function novoRegistro() {
        try {
            const nameRegister = {
                titulo: 'Novo Registro',
                conteudo: 'digite o seu registro',
            };

            const data = await newRegister(id, nameRegister);

            setNomeRegistro(data);
            navigate(`/registro/${data.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function carregarRegistros() {
            try {
                const data = await getProjectById(id);
                const dataReg = await getRegisterId(id);

                setProject(data);
                setRegistros(dataReg);
            } catch (error) {
                console.error(error);
            }
        }

        carregarRegistros();
    }, [id]);

    const registrosOrdenados = [...registros].sort(
        (a, b) => new Date(b.criado_em) - new Date(a.criado_em),
    );

    const formatRegistros = registrosOrdenados.reduce((acc, registro) => {
        const data = new Date(registro.criado_em);

        const ano = data.getFullYear();

        const mes = data.toLocaleDateString('pt-BR', {
            month: 'long',
        });

        const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);

        //cria o ano
        if (!acc[ano]) {
            acc[ano] = {};
        }

        //cria o mes
        if (!acc[ano][mesFormatado]) {
            acc[ano][mesFormatado] = [];
        }

        //adicionando os registros
        acc[ano][mesFormatado].push(registro);

        return acc;
    }, {});

    useEffect(() => {
        async function carregarReunioes() {
            try {
                const dataMeeting = await getMeetingById(id);

                setReunioes(dataMeeting);
            } catch (error) {
                console.error(error);
            }
        }

        carregarReunioes();
    }, [id]);

    const reunoiesOrdenadas = [...reunioes].sort(
        (a, b) => new Date(b.criado_em) - new Date(a.criado_em),
    );

    const formatReunioes = reunoiesOrdenadas.reduce((acc, reuniao) => {
        const data = new Date(reuniao.criado_em);

        const ano = data.getFullYear();

        const mes = data.toLocaleDateString('pt-BR', {
            month: 'long',
        });

        const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);

        //cria o ano
        if (!acc[ano]) {
            acc[ano] = {};
        }

        //cria o mes
        if (!acc[ano][mesFormatado]) {
            acc[ano][mesFormatado] = [];
        }

        //adicionando os registros
        acc[ano][mesFormatado].push(reuniao);

        return acc;
    }, {});

    return (
        <div className="w-full lg:flex">
            <DesktopSidebar />
            <MobileHeader />
            <div className="w-full p-4 ">
                <DescriptionProjectMobile
                    project={project}
                    expand={expand}
                    setExpand={setExpand}
                    onClick={() => navigate(`/projeto/${id}/editar-projeto/`)}
                />
                <DescriptionProjectDesktop
                    project={project}
                    onClick={() => navigate(`/projeto/${id}/editar-projeto/`)}
                />
                <ComponentMenu
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    tabs={tabs}
                ></ComponentMenu>
                {currentTab === 'Documentos' &&
                    (documentos.projeto?.categorias?.length === 0 ? (
                        <div className="w-full min-h-[60vh] lg:min-h-[70vh] flex-col  gap-2 flex items-center justify-center">
                            <div className="w-full gap-2 flex flex-col items-center justify-center rounded-2xl">
                                <img
                                    src={documentosvazios}
                                    className="w-40 h-40 lg:w-55 lg:h-55"
                                    alt="documentos"
                                />
                                <ParagraphLarge className="text-(--cinza-700)">
                                    Nenhum Documento Por Aqui Ainda
                                </ParagraphLarge>
                            </div>
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <div className="w-full gap-2  flex flex-col items-center justify-center">
                                    <ParagraphSmall className=" text-center text-(--cinza-600)">
                                        Crie uma categoria e comece a documentar os requisitos,
                                        decisões e informações adicionais do seu projeto.
                                    </ParagraphSmall>
                                    <IconButton
                                        onClick={() => setOpenModalCategoria(true)}
                                        className="w-40 gap-2 lg:p-2.5 lg:w-52 lg:flex hover:bg-(--color-dark)"
                                        icon={<FolderPlus />}
                                    >
                                        Nova Categoria
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col w-full items-center gap-4 pt-5 lg:items-start lg:gap-5">
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <IconButton
                                    onClick={() => setOpenModalCategoria(true)}
                                    className="w-40 gap-2 lg:p-2.5 lg:w-52 lg:flex hover:bg-(--color-dark)"
                                    icon={<FolderPlus />}
                                >
                                    Nova Categoria
                                </IconButton>
                            )}

                            <Documents
                                openModalDeleteCategoria={openModalDeleteCategoria}
                                setOpenModalDeleteCategoria={setOpenModalDeleteCategoria}
                                documentos={documentos}
                                deletarCategoria={deletarCategoria}
                                project={project}
                                novoDocumento={novoDocumento}
                            ></Documents>
                            {openModalDeleteCategoria && (
                                <PopUp
                                    tituloNovo={'Deletando a Categoria'}
                                    showInput={false}
                                    tituloCategoria={`Tem certeza de que deseja excluir a categoria ${openModalDeleteCategoria.nome}? `}
                                    onClick={() => deletarCategoria(openModalDeleteCategoria.id)}
                                    onClose={() => setOpenModalDeleteCategoria(null)}
                                    children={'Confirmar'}
                                ></PopUp>
                            )}
                        </div>
                    ))}
                {openModalCategoria && (
                    <PopUp
                        erro={erro}
                        tituloNovo={'Adicionar Categoria'}
                        tituloCategoria={'Titulo da Categoria'}
                        value={nomeCategoria.titulo}
                        showInput={true}
                        placeholder={'Nova Categoria'}
                        onClick={novaCategoria}
                        onChange={(e) => {
                            setNomeCategoria(e.target.value);
                            setErro('');
                        }}
                        onClose={() => {
                            setOpenModalCategoria(false);
                            setNomeCategoria('');
                            setErro('');
                        }}
                        children={'Criar'}
                    />
                )}

                {currentTab === 'Registros' &&
                    (!registros || registros.length === 0 ? (
                        <div className="w-full min-h-[60vh] lg:min-h-[70vh] flex-col  gap-2 flex items-center justify-center">
                            <div className="w-full gap-2 flex flex-col items-center justify-center rounded-2xl">
                                <img
                                    src={registrosvazios}
                                    className="w-40 h-40 lg:w-55 lg:h-55"
                                    alt="documentos"
                                />
                                <ParagraphLarge className="text-(--cinza-700)">
                                    Nenhum Registro Por Aqui Ainda
                                </ParagraphLarge>
                            </div>
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <div className="w-full gap-2  flex flex-col items-center justify-center">
                                    <ParagraphSmall className=" text-center text-(--cinza-600) lg:line-clamp-2">
                                        Guarde anotações, decisões, ideias e informações importantes
                                        para o desenvovilmento do projeto
                                    </ParagraphSmall>
                                    <ButtonRegistrer
                                        onClick={novoRegistro}
                                        className="lg:w-40 bg-(--color-base) text-white lg:h-10 lg:p-5 hover:bg-(--color-dark)"
                                    >
                                        + Novo Registro
                                    </ButtonRegistrer>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="pt-4">
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <ButtonRegistrer
                                    onClick={novoRegistro}
                                    className="lg:w-84 bg-(--color-base) text-white lg:h-15 lg:p-5 hover:bg-(--color-dark)"
                                >
                                    + Novo Registro
                                </ButtonRegistrer>
                            )}
                            <Register
                                expandRegsister={expandRegsister}
                                setExpandRegister={setExpandRegister}
                                formatRegistros={formatRegistros}
                            ></Register>
                        </div>
                    ))}

                {currentTab === 'Reuniões' &&
                    (!reunioes || reunioes.length === 0 ? (
                        <div className="w-full min-h-[60vh] lg:min-h-[70vh] flex-col  gap-2 flex items-center justify-center">
                            <div className="w-full gap-2 flex flex-col items-center justify-center rounded-2xl">
                                <img
                                    src={reunioesvazios}
                                    className="w-55 h-55 lg:w-65 lg:h-65 "
                                    alt="documentos"
                                />
                                <ParagraphLarge className="text-(--cinza-700)">
                                    Nenhuma Reunião Registrada Ainda
                                </ParagraphLarge>
                            </div>
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <div className="w-full gap-2  flex flex-col items-center justify-center">
                                    <ParagraphSmall className=" text-center text-(--cinza-600) lg:line-clamp-2">
                                        Registre suas reuniões para acompanhar decisões,
                                        alinhamentos e próximos passos do projeto
                                    </ParagraphSmall>
                                    <ButtonRegistrer
                                        className="lg:w-40 bg-(--color-base) text-white lg:h-10 lg:p-5 hover:bg-(--color-dark)"
                                        onClick={() => setOpenModalReuniao(true)}
                                    >
                                        + Nova Reunião
                                    </ButtonRegistrer>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="pt-4">
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <ButtonRegistrer
                                    className="lg:w-84 bg-(--color-base) text-white lg:h-15 lg:p-5 hover:bg-(--color-dark)"
                                    onClick={() => setOpenModalReuniao(true)}
                                >
                                    + Nova Reunião
                                </ButtonRegistrer>
                            )}

                            <Meeting
                                expandReuniao={expandReuniao}
                                setExpandReuniao={setExpandReuniao}
                                formatReunioes={formatReunioes}
                                PopUp={PopUp}
                                project={project}
                            ></Meeting>
                        </div>
                    ))}
                {openModalReuniao && (
                    <PopUp
                        erro={erro}
                        tituloNovo={'Adicionar Reunião'}
                        tituloCategoria={'Titulo da Reunião'}
                        value={nomeReuniao.titulo}
                        showInput={true}
                        placeholder={'Nova Reunião'}
                        onClick={novaReuniao}
                        onChange={(e) => {
                            setNomeReuniao(e.target.value);
                            setErro('');
                        }}
                        onClose={() => {
                            setOpenModalReuniao(false);
                            setNomeReuniao('');
                            setErro('');
                        }}
                        children={'Criar'}
                    />
                )}
            </div>
        </div>
    );
}

export default ProjectDetails;
