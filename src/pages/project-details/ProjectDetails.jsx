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
} from '../../services/api';
import DescriptionProject from './components/DescriptionProject';
import DesktopSidebar from '../../components/DesktopSidebar';

function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [reunioes, setReunioes] = useState([]);
    const [currentTab, setCurrentTab] = useState('Documentos');
    const tabs = ['Documentos', 'Registros', 'Reuniões'];
    const [openModal, setOpenModal] = useState(false);
    const [expand, setExpand] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');

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

            setOpenModal(false);
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
                <DescriptionProject project={project} expand={expand} setExpand={setExpand} />
                <ComponentMenu
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    tabs={tabs}
                ></ComponentMenu>
                {currentTab === 'Documentos' && (
                    <div className="flex flex-col w-full items-center gap-4 pt-5 ">
                        <IconButton
                            onClick={() => setOpenModal(true)}
                            className="w-40 gap-2"
                            icon={<FolderPlus />}
                        >
                            Nova Categoria
                        </IconButton>
                        {openModal && (
                            <PopUp
                                nomeCategoria={nomeCategoria}
                                setNomeCategoria={setNomeCategoria}
                                novaCategoria={novaCategoria}
                                onClose={() => setOpenModal(false)}
                            />
                        )}
                        <Documents
                            documentos={documentos}
                            deletarCategoria={deletarCategoria}
                        ></Documents>
                    </div>
                )}
                {currentTab === 'Registros' && (
                    <div className="pt-4">
                        <ButtonRegistrer>+ Novo Registro</ButtonRegistrer>
                        <Register formatRegistros={formatRegistros}></Register>
                    </div>
                )}
                {currentTab === 'Reuniões' && (
                    <div className="pt-4">
                        <ButtonRegistrer>+ Nova Reunião</ButtonRegistrer>
                        <Meeting formatReunioes={formatReunioes}></Meeting>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectDetails;
