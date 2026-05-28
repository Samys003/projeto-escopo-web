import MobileHeader from '../../components/MobileHeader';
import IconButton from '../../components/IconButton';
import ComponentMenu from './components/ComponentMenu';
import { useEffect, useState } from 'react';
import Documents from './components/Documents';
import ButtonRegistrer from './components/ButtonRegister';
import Register from './components/Register';
import Meeting from './components/Meeting';
import PopUp from './components/PopUp';
import { useParams } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import {
    deleteCategoria,
    getMeetingById,
    getProjectById,
    getProjectDocumentById,
    getRegisterById,
    newCategoria,
    newMeeting,
} from '../../services/api';
import DesktopSidebar from '../../components/DesktopSidebar';
import DescriptionProjectMobile from './components/DescriptionProjectMobile';
import DescriptionProjectDesktop from './components/DescriptionProjectDesktop';

function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [reunioes, setReunioes] = useState([]);
    const [currentTab, setCurrentTab] = useState('Documentos');
    const tabs = ['Documentos', 'Registros', 'Reuniões'];
    const [openModalCategoria, setOpenModalCategoria] = useState(false);
    const [openModalReuniao, setOpenModalReuniao] = useState(false);
    const [expand, setExpand] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [nomeReuniao, setNomeReuniao] = useState('');

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

    async function novaCategoria() {
        try {
            const nameCategoria = {
                titulo: nomeCategoria,
            };

            const data = await newCategoria(id, nameCategoria);
            const dataDoc = await getProjectDocumentById(id);

            setNomeCategoria(data);

            setDocumentos(dataDoc);

            setOpenModalCategoria(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function novaReuniao() {
        try {
            const nameMeeting = {
                titulo: nomeReuniao,
            };

            const data = await newMeeting(id, nameMeeting);
            const dataDoc = await getMeetingById(id);

            setNomeReuniao(data);

            setReunioes(dataDoc);

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
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function carregarRegistros() {
            try {
                const data = await getProjectById(id);
                const dataReg = await getRegisterById(id);

                setProject(data);
                setRegistros(dataReg);
            } catch (error) {
                console.error(error);
            }
        }

        carregarRegistros();
    }, [id]);

    const formatRegistros = registros.reduce((acc, registro) => {
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

    const formatReunioes = reunioes.reduce((acc, reuniao) => {
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
                <DescriptionProjectMobile project={project} expand={expand} setExpand={setExpand} />
                <DescriptionProjectDesktop project={project} />
                <ComponentMenu
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    tabs={tabs}
                ></ComponentMenu>
                {currentTab === 'Documentos' && (
                    <div className="flex flex-col w-full items-center gap-4 pt-5 lg:items-start lg:gap-5">
                        {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                            <IconButton
                                onClick={() => setOpenModalCategoria(true)}
                                className="w-40 gap-2 lg:p-2.5 lg:w-52 lg:flex "
                                icon={<FolderPlus />}
                            >
                                Nova Categoria
                            </IconButton>
                        )}
                        {openModalCategoria && (
                            <PopUp
                                tituloNovo={'Adicionar Categoria'}
                                tituloCategoria={'Titulo da Categoria'}
                                value={nomeCategoria}
                                placeholder={'Nova Categoria'}
                                onClick={novaCategoria}
                                onChange={(e) => setNomeCategoria(e.target.value)}
                                onClose={() => setOpenModalCategoria(false)}
                            />
                        )}
                        <Documents
                            documentos={documentos}
                            deletarCategoria={deletarCategoria}
                            project={project}
                        ></Documents>
                    </div>
                )}
                {currentTab === 'Registros' && (
                    <div className="pt-4">
                        {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                            <ButtonRegistrer>+ Novo Registro</ButtonRegistrer>
                        )}
                        <Register formatRegistros={formatRegistros}></Register>
                    </div>
                )}
                {currentTab === 'Reuniões' && (
                    <div className="pt-4">
                        {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                            <ButtonRegistrer onClick={() => setOpenModalReuniao(true)}>
                                + Nova Reunião
                            </ButtonRegistrer>
                        )}
                        {openModalReuniao && (
                            <PopUp
                                tituloNovo={'Nova Reunião'}
                                tituloCategoria={'Titulo da Reunião'}
                                value={nomeReuniao}
                                placeholder={'Nova Reuniao'}
                                onClick={novaReuniao}
                                onChange={(e) => setNomeReuniao(e.target.value)}
                                onClose={() => setOpenModalReuniao(false)}
                            />
                        )}

                        <Meeting formatReunioes={formatReunioes}></Meeting>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectDetails;
