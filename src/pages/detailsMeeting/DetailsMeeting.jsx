import { ChevronsLeft, Pencil, Trash2 } from 'lucide-react';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import {
    deleteMeeting,
    getDetailsMeetingById,
    newLinkMeeting,
    newUserMeeting,
    getUserMeeting,
    updateLinkMeeting,
    updateMeeting,
    newUserGuest,
    deletelinkMeeting,
    deleteUserMeeting,
    deleteUserGuest,
} from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Title2 from '../../components/Typography/Title2';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import IconButton from '../../components/IconButton';
import ParagraphSmall from '../../components/Typography/ParagraphSmall';
import user_default from '../project-details/assets/user-default.jpg';
import PopUp from '../project-details/components/PopUp';
import { getProjectById } from '../../services/api';
import PopUpInputs from './components/PopUpInputs';
import PopUpTranscicao from './components/PopUpTranscicao';

function DetailsMeeting() {
    const { id } = useParams();

    const [detalhesReuniao, setDetalhesReuniao] = useState({});
    const [erro, setErro] = useState('');
    const [openModalTitulo, setOpenModalTitulo] = useState(false);
    const [project, setProject] = useState(null);
    const [nomeReuniao, setNomeReuniao] = useState('');
    const [openModelDeleteReuniao, setOpenDeleteReuniao] = useState(false);
    const [openDeleteLinkAdicional, setOpenDeleteLinkAdicional] = useState(null);
    const [openModalLink, setOpenModalLink] = useState(false);
    const [openModalRecording, setOpenModalRecording] = useState(false);
    const [linkreuniao, setLinkReuniao] = useState('');
    const [novoLinkNome, setNovoLinkNome] = useState('');
    const [novoLinkUrl, setNovoLinkUrl] = useState('');
    const [openModalNovoParticipante, setOpenModalNovoParticipante] = useState('');
    const [novoParticipante, setNovoParticipante] = useState('');
    const [novoConvidado, setNovoConvidado] = useState('');
    const [openModalConvidado, setOpenModalConvidado] = useState(false);
    const [novoConvidadoCargo, setNovoConvidadoCargo] = useState('');
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [openModalDeleteGuest, setOpenModalDeleteGuest] = useState(null);
    const [openModalTranscricao, setOpenModalTranscricao] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarReuniao() {
            try {
                const data = await getDetailsMeetingById(id);

                setDetalhesReuniao(data);
            } catch (error) {
                console.error(error);
            }
        }

        carregarReuniao();
    }, [id]);
    useEffect(() => {
        if (!detalhesReuniao?.projeto_id) return;

        async function carregarProjeto() {
            try {
                const data = await getProjectById(detalhesReuniao.projeto_id);

                setProject(data);
            } catch (error) {
                console.error(error);
            }
        }

        carregarProjeto();
    }, [detalhesReuniao?.projeto_id]);

    async function atualizarTituloReuniao() {
        if (!nomeReuniao.trim()) {
            setErro('Esse campo não pode estar vazio! ');
            return;
        }

        const tituloReuniao = {
            titulo: nomeReuniao,
        };

        try {
            await updateMeeting(id, tituloReuniao);

            setDetalhesReuniao((prev) => ({
                ...prev,
                titulo: nomeReuniao,
            }));
            setOpenModalTitulo(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function atualizarLinkReuniao() {
        const linkAtual = detalhesReuniao.links?.find((link) => link.tipo_link === 'reuniao');

        if (!linkreuniao.trim()) {
            setErro('O link da gravação não pode ficar vazio.');
            return;
        }

        if (linkAtual?.url === linkreuniao.trim()) {
            setErro('O novo link é igual ao link atual.');
            return;
        }

        try {
            if (linkAtual) {
                await updateLinkMeeting({
                    id: linkAtual.id,
                    nome: 'reuniao',
                    url: linkreuniao,
                });
            } else {
                await newLinkMeeting(id, { url: linkreuniao, tipo_link_id: 1, nome: 'reuniao' });
            }
            const reuniaoAtualizada = await getDetailsMeetingById(id);

            setDetalhesReuniao(reuniaoAtualizada);
            setOpenModalRecording(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function criarLinkAdicional() {
        if (!novoLinkNome.trim() || !novoLinkUrl.trim()) {
            setErro('Ambos os campos (Nome e Link) são obrigatórios.');
            return;
        }

        try {
            await newLinkMeeting(id, {
                url: novoLinkUrl,
                tipo_link_id: 2,
                nome: novoLinkNome,
            });

            const reuniaoAtualizada = await getDetailsMeetingById(id);
            setDetalhesReuniao(reuniaoAtualizada);

            setNovoLinkNome('');
            setNovoLinkUrl('');
            setOpenModalLink(false);
        } catch (error) {
            console.error(error);
            setErro('Ocorreu um erro ao adicionar o link.');
        }
    }

    async function deletarLinkAdicional(link_id) {
        try {
            await deletelinkMeeting(link_id);

            const reuniaoAtualizada = await getDetailsMeetingById(id);
            setDetalhesReuniao(reuniaoAtualizada);
            setOpenDeleteLinkAdicional(null);
        } catch (error) {
            console.error(error);
        }
    }

    async function adicionarNovoParticipante() {
        if (!novoParticipante.trim()) {
            setErro('O campo de email não pode estar vazio');
            return;
        }

        try {
            setErro('');

            const usuario = await getUserMeeting(novoParticipante);

            if (!usuario || !usuario.id) {
                setErro('Usuario não encontrado, verifique se o e-mail esta correto');
                return;
            }

            const usuarioId = usuario.id;

            await newUserMeeting(id, usuarioId);

            const reuniaoAtualizada = await getDetailsMeetingById(id);
            setDetalhesReuniao(reuniaoAtualizada);

            setNovoParticipante('');
            setOpenModalNovoParticipante(false);
        } catch (error) {
            console.error(error);
            setErro('Participante Invalido');
        }
    }

    async function deletarUsuarioReuniao(id_usuario) {
        try {
            await deleteUserMeeting(id, id_usuario);

            const reuniaoAtualizada = await getDetailsMeetingById(id);
            setDetalhesReuniao(reuniaoAtualizada);
            setUsuarioSelecionado(null);
        } catch (error) {
            console.error(error);
        }
    }

    async function adicionarNovoConvidado() {
        if (!novoConvidado.trim()) {
            setErro('O campo de Convidado não pode estar vazio');
            return;
        }

        try {
            await newUserGuest(id, { nome: novoConvidado, cargo: novoConvidadoCargo });

            const reuniaoAtualizada = await getDetailsMeetingById(id);
            setDetalhesReuniao(reuniaoAtualizada);

            setNovoConvidado('');
            setNovoConvidadoCargo('');
            setOpenModalConvidado(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function deletarConvidado(id_convidado) {
        try {
            await deleteUserGuest(id_convidado);

            const reuniaoAtualizada = await getDetailsMeetingById(id);
            setDetalhesReuniao(reuniaoAtualizada);
            setOpenModalDeleteGuest(null);
        } catch (error) {
            console.error(error);
        }
    }

    async function deletarReuniao() {
        try {
            await deleteMeeting(id);

            const dataDoc = await getProjectById(detalhesReuniao.projeto_id);

            setProject(dataDoc);
            navigate(-1);
            setOpenDeleteReuniao(false);
        } catch (error) {
            console.error(error);
        }
    }

    const gerarIniciais = (nomeCompleto) => {
        return nomeCompleto
            .split(' ')
            .map((parte) => parte[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="w-full lg:flex ">
            <DesktopSidebar></DesktopSidebar>
            <MobileHeader></MobileHeader>
            <div className="flex flex-col px-4 w-full">
                <div className="flex gap-2 lg:items-start p-2 border-b border-(--cinza-300) ">
                    <button>
                        <ChevronsLeft
                            onClick={() => navigate(`/projeto/${detalhesReuniao?.projeto_id}`)}
                            className="w-9 h-9"
                        />
                    </button>
                    <div className="flex w-full pb-2  items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <Title2 className="font-bold leading-none">
                                    {detalhesReuniao.titulo}
                                </Title2>

                                {(project?.nivel_acesso_id == 1 ||
                                    project?.nivel_acesso_id == 2) && (
                                    <IconButton
                                        onClick={() => {
                                            setNomeReuniao(detalhesReuniao.titulo);
                                            setOpenModalTitulo(true);
                                        }}
                                        className="bg-transparent hover:bg-(--roxo-light)"
                                        icon={<Pencil className="text-black w-5 h-5" />}
                                    />
                                )}
                            </div>
                            {openModalTitulo && (
                                <PopUp
                                    onClose={() => {
                                        setOpenModalTitulo(false);
                                        setNomeReuniao('');
                                        setErro('');
                                    }}
                                    value={nomeReuniao}
                                    onChange={(e) => {
                                        setNomeReuniao(e.target.value);
                                        setErro('');
                                    }}
                                    onClick={atualizarTituloReuniao}
                                    tituloNovo={'Atualizar Reunião'}
                                    tituloCategoria={'Titulo da Reuniao'}
                                    placeholder={'Novo Titulo'}
                                    showInput={true}
                                    children={'Atualizar'}
                                    erro={erro}
                                ></PopUp>
                            )}
                            <ParagraphMedium className="text-(--cinza-500)">
                                {'Realizado em: '}
                                {new Date(detalhesReuniao?.criado_em).toLocaleDateString()}
                            </ParagraphMedium>
                        </div>
                    </div>
                    {(project?.nivel_acesso_id == 1 || project?.nivel_acesso_id == 2) && (
                        <IconButton
                            onClick={() => setOpenDeleteReuniao(true)}
                            className="w-10 h-10 hover:bg-(--color-dark)"
                            icon={<Trash2 />}
                        ></IconButton>
                    )}
                    {openModelDeleteReuniao && (
                        <PopUp
                            tituloNovo={'Deletando a Reunião'}
                            showInput={false}
                            tituloCategoria={`Tem certeza de que deseja excluir a Reunião ${detalhesReuniao.titulo}? `}
                            onClick={deletarReuniao}
                            onClose={() => setOpenDeleteReuniao(false)}
                            children={'Confirmar'}
                        ></PopUp>
                    )}
                </div>
                <div className="px-[3%]">
                    <div className="w-full flex flex-col gap-3 p-3 border rounded-2xl border-(--cinza-300)  mt-3 text-start">
                        <div className="flex items-center ">
                            <ParagraphMedium className="text-(--cinza-600)">
                                Gravação da Reunião
                            </ParagraphMedium>
                            {(project?.nivel_acesso_id == 1 || project?.nivel_acesso_id == 2) && (
                                <IconButton
                                    onClick={() => {
                                        const linkAtual = detalhesReuniao.links?.find(
                                            (link) => link.tipo_link === 'reuniao',
                                        );

                                        setLinkReuniao(linkAtual?.url || '');
                                        setOpenModalRecording(true);
                                    }}
                                    className="bg-transparent w-8 h-8 hover:bg-(--roxo-light)"
                                    icon={<Pencil className="text-black w-8 h-8" />}
                                ></IconButton>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {detalhesReuniao.links?.filter((link) => link.tipo_link === 'reuniao')
                                .length === 0 ? (
                                <ParagraphSmall className="italic text-(--cinza-500)">
                                    Nenhuma Gravacao registrada
                                </ParagraphSmall>
                            ) : (
                                detalhesReuniao.links
                                    ?.filter((link) => link.tipo_link === 'reuniao')
                                    .map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <IconButton className="w-35 hover:bg-(--color-dark)">
                                                Acessar Gravação
                                            </IconButton>
                                        </a>
                                    ))
                            )}
                            {openModalRecording && (
                                <PopUp
                                    onClose={() => {
                                        setOpenModalRecording(false);
                                        setLinkReuniao('');
                                        setErro('');
                                    }}
                                    value={linkreuniao}
                                    onChange={(e) => {
                                        setLinkReuniao(e.target.value);
                                        setErro('');
                                    }}
                                    onClick={atualizarLinkReuniao}
                                    tituloNovo={'Atualizar Gravação'}
                                    tituloCategoria={'Link da Gravação'}
                                    placeholder={'Nova Gravação'}
                                    showInput={true}
                                    children={'Atualizar'}
                                    erro={erro}
                                ></PopUp>
                            )}

                            <button onClick={() => setOpenModalTranscricao(true)} className="w-22">
                                <ParagraphSmall className="text-(--color-base) underline hover:bg-(--roxo-light)">
                                    Transcrição
                                </ParagraphSmall>
                            </button>
                            {openModalTranscricao && (
                                <PopUpTranscicao
                                    onClose={() => setOpenModalTranscricao(false)}
                                ></PopUpTranscicao>
                            )}
                        </div>
                    </div>
                    <div className="w-full flex flex-col border mt-3 rounded-2xl border-(--cinza-300) p-2">
                        <ParagraphSmall>Links Adicionais</ParagraphSmall>
                        {detalhesReuniao?.links
                            ?.filter((link) => link.tipo_link === 'link_adicional')
                            .map((link) => (
                                <div key={link.id} className="flex pl-2 text-(--color-base) ">
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <button>
                                            <ParagraphSmall className="underline hover:bg-(--roxo-light)">
                                                {link.nome}
                                            </ParagraphSmall>
                                        </button>
                                    </a>
                                    {(project?.nivel_acesso_id == 1 ||
                                        project?.nivel_acesso_id == 2) && (
                                        <IconButton
                                            onClick={() => setOpenDeleteLinkAdicional(link)}
                                            className="bg-transparent hover:bg-(--roxo-light) "
                                            icon={<Trash2 className="text-black w-4 h-4 " />}
                                        ></IconButton>
                                    )}
                                </div>
                            ))}
                        {openDeleteLinkAdicional && (
                            <PopUp
                                tituloNovo={'Deletando o Link Adicional'}
                                showInput={false}
                                tituloCategoria={`Tem certeza de que deseja excluir o Link: ${openDeleteLinkAdicional.nome}? `}
                                onClick={() => deletarLinkAdicional(openDeleteLinkAdicional.id)}
                                onClose={() => setOpenDeleteLinkAdicional(null)}
                                children={'Confirmar'}
                            ></PopUp>
                        )}
                        <div className="w-full flex items-center p-1 justify-center">
                            {(project?.nivel_acesso_id == 1 || project?.nivel_acesso_id == 2) && (
                                <IconButton
                                    onClick={() => setOpenModalLink(true)}
                                    className="w-29 hover:bg-(--color-dark)"
                                >
                                    Adicionar link
                                </IconButton>
                            )}
                        </div>
                        {openModalLink && (
                            <PopUpInputs
                                tituloNovo={'Novo Link'}
                                onClose={() => {
                                    setOpenModalLink(false);
                                    setNovoLinkNome('');
                                    setNovoLinkUrl('');
                                    setErro('');
                                }}
                                erro={erro}
                                tituloCategoria={'Nome do Link:'}
                                placeholder={'Titulo do Link'}
                                value={novoLinkNome}
                                onChange={(e) => {
                                    setNovoLinkNome(e.target.value);
                                    setErro('');
                                }}
                                segundoTitulo={'Link'}
                                placeholder2={'Endereco do Link'}
                                value2={novoLinkUrl}
                                onChange2={(e) => {
                                    setNovoLinkUrl(e.target.value);
                                    setErro('');
                                }}
                                children={'Adicionar'}
                                onClick={criarLinkAdicional}
                            ></PopUpInputs>
                        )}
                    </div>

                    <div className="p-2 mt-3 border border-(--cinza-300) rounded-2xl ">
                        <div>
                            <ParagraphSmall>Participantes</ParagraphSmall>
                        </div>
                        <div className="">
                            {detalhesReuniao?.usuarios?.map((usuario, index) => (
                                <div
                                    key={`${usuario.id}-${index}`}
                                    className="flex justify-between py-2 items-center w-full "
                                >
                                    <div className="flex gap-1 items-center">
                                        <img
                                            className="w-10 rounded-full"
                                            src={usuario.foto_perfil || user_default}
                                        />
                                        <ParagraphSmall className="text-(--cinza-500)">
                                            {usuario.nome}
                                        </ParagraphSmall>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ParagraphSmall className="text-(--cinza-500)">
                                            {usuario.cargo}
                                        </ParagraphSmall>
                                        {(project?.nivel_acesso_id == 1 ||
                                            project?.nivel_acesso_id == 2) && (
                                            <IconButton
                                                onClick={() => setUsuarioSelecionado(usuario)}
                                                className="bg-transparent flex hover:bg-(--roxo-light)"
                                                icon={<Trash2 className="text-black w-4" />}
                                            ></IconButton>
                                        )}
                                    </div>
                                    {usuarioSelecionado && (
                                        <PopUp
                                            tituloNovo={'Deletando Participante'}
                                            showInput={false}
                                            tituloCategoria={`Tem certeza de que deseja excluir o participante: ${usuarioSelecionado.nome}? `}
                                            onClick={() =>
                                                deletarUsuarioReuniao(usuarioSelecionado.id)
                                            }
                                            onClose={() => setUsuarioSelecionado(null)}
                                            children={'Confirmar'}
                                        ></PopUp>
                                    )}
                                </div>
                            ))}
                            <div className="w-full p-2 items-center justify-center flex">
                                {(project?.nivel_acesso_id == 1 ||
                                    project?.nivel_acesso_id == 2) && (
                                    <IconButton
                                        onClick={() => setOpenModalNovoParticipante(true)}
                                        className="hover:bg-(--color-dark)"
                                    >
                                        Novo Participante
                                    </IconButton>
                                )}
                            </div>
                        </div>
                        {openModalNovoParticipante && (
                            <PopUp
                                onClose={() => {
                                    setOpenModalNovoParticipante(false);
                                    setNovoParticipante('');
                                    setErro('');
                                }}
                                value={novoParticipante}
                                onChange={(e) => {
                                    setNovoParticipante(e.target.value);
                                    setErro('');
                                }}
                                onClick={adicionarNovoParticipante}
                                tituloNovo={'Novo Participante'}
                                tituloCategoria={'Email'}
                                placeholder={'email@example.com'}
                                showInput={true}
                                children={'Adicionar'}
                                erro={erro}
                            ></PopUp>
                        )}
                    </div>
                    <div className="p-2 mt-3 border border-(--cinza-300) rounded-2xl ">
                        <ParagraphSmall>Convidados</ParagraphSmall>
                        {detalhesReuniao?.convidados?.map((convidado) => (
                            <div key={convidado.id} className="flex justify-between items-center ">
                                <div className="flex items-center py-2 gap-1">
                                    <div className="flex rounded-full text-white w-10 justify-center items-center h-10 bg-(--cinza-200)">
                                        {gerarIniciais(convidado.nome)}
                                    </div>
                                    <ParagraphSmall className="text-(--cinza-500)">
                                        {convidado.nome}
                                    </ParagraphSmall>
                                </div>
                                <div className="flex items-center">
                                    <ParagraphSmall className="text-(--cinza-500)">
                                        {convidado.cargo}
                                    </ParagraphSmall>
                                    {(project?.nivel_acesso_id == 1 ||
                                        project?.nivel_acesso_id == 2) && (
                                        <IconButton
                                            onClick={() => setOpenModalDeleteGuest(convidado)}
                                            className="bg-transparent flex hover:bg-(--roxo-light)"
                                            icon={<Trash2 className="text-black w-4 " />}
                                        ></IconButton>
                                    )}
                                </div>
                            </div>
                        ))}
                        {openModalDeleteGuest && (
                            <PopUp
                                tituloNovo={'Deletando Convidado'}
                                showInput={false}
                                tituloCategoria={`Tem certeza de que deseja excluir o convidado: ${openModalDeleteGuest.nome}? `}
                                onClick={() => deletarConvidado(openModalDeleteGuest.id)}
                                onClose={() => setOpenModalDeleteGuest(null)}
                                children={'Confirmar'}
                            ></PopUp>
                        )}
                        <div className="w-full p-2 items-center justify-center flex">
                            {(project?.nivel_acesso_id == 1 || project?.nivel_acesso_id == 2) && (
                                <IconButton
                                    onClick={() => setOpenModalConvidado(true)}
                                    className="hover:bg-(--color-dark)"
                                >
                                    Novo Convidado
                                </IconButton>
                            )}
                        </div>
                        {openModalConvidado && (
                            <PopUpInputs
                                tituloNovo={'Novo Convidado'}
                                onClose={() => {
                                    setOpenModalConvidado(false);
                                    setNovoConvidado('');
                                    setNovoConvidadoCargo('');
                                    setErro('');
                                }}
                                erro={erro}
                                tituloCategoria={'Nome do Convidado:'}
                                placeholder={'Ex: João Silva'}
                                value={novoConvidado}
                                onChange={(e) => {
                                    setNovoConvidado(e.target.value);
                                    setErro('');
                                }}
                                segundoTitulo={'Cargo (Opcional)'}
                                placeholder2={'Ex: Desenvolvedor'}
                                value2={novoConvidadoCargo}
                                onChange2={(e) => {
                                    setNovoConvidadoCargo(e.target.value);
                                    setErro('');
                                }}
                                children={'Adicionar'}
                                onClick={adicionarNovoConvidado}
                            ></PopUpInputs>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsMeeting;
