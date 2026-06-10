import { ChevronsLeft, EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDetailsMeetingById } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Title2 from '../../components/Typography/Title2';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import IconButton from '../../components/IconButton';
import ParagraphSmall from '../../components/Typography/ParagraphSmall';
import user_default from '../project-details/assets/user_default.svg';
import PopUp from '../project-details/components/PopUp';

function DetailsMeeting() {
    const { id } = useParams();

    const [detalhesReuniao, setDetalhesReuniao] = useState({});
    const [erro, setErro] = useState('');
    const [openModal, setOpenModal] = useState(false);

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
                            onClick={() => navigate(`/projeto/${detalhesReuniao.projeto_id}`)}
                            className="w-9 h-9"
                        />
                    </button>
                    <div className="flex w-full pb-2  items-center justify-between">
                        <div className="flex flex-col ">
                            <Title2 className="font-bold leading-none">
                                {detalhesReuniao.titulo}
                            </Title2>
                            <ParagraphMedium className="text-(--cinza-500)">
                                {'Realizado em: '}
                                {new Date(detalhesReuniao?.criado_em).toLocaleDateString()}
                            </ParagraphMedium>
                        </div>
                    </div>
                    <IconButton
                        className="w-10 h-10 hover:bg-(--color-dark)"
                        icon={<Trash2 />}
                    ></IconButton>
                </div>
                <div className="w-full flex flex-col gap-3 p-3 border rounded-2xl border-(--cinza-300)  mt-3 text-start">
                    <div className="flex items-center ">
                        <ParagraphMedium className="text-(--cinza-600)">
                            Gravação da Reunião
                        </ParagraphMedium>
                        <IconButton
                            onClick={() => setOpenModal(true)}
                            className="bg-transparent w-8 h-8 hover:bg-(--roxo-light)"
                            icon={<Pencil className="text-black w-8 h-8" />}
                        ></IconButton>
                        {openModal && (
                            <PopUp
                             onClose={setOpenModal(false)}
                            value={link.url}
                            onChange={}
                            onClick={}
                            tituloNovo={"Gravacão"}
                            tituloCategoria={"Reunião"}
                            placeholder={"Link Da Reunião"}
                            showInput={true}
                            children={"Atualizar"}
                            erro={erro}>

                            </PopUp>
                        )}
                    </div>

                    <div className="flex">
                        {detalhesReuniao.links
                            ?.filter((link) => link.tipo_link === 'reuniao')
                            .map((link) => (
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    <IconButton
                                        key={link.id}
                                        className="w-35 hover:bg-(--color-dark)"
                                    >
                                        Acessar Gravação
                                    </IconButton>
                                </a>
                            ))}
                        <button className="w-22 hidden">
                            <ParagraphSmall className="text-(--color-base) underline">
                                Transcrição
                            </ParagraphSmall>
                        </button>
                    </div>
                </div>
                <div className="w-full flex flex-col border mt-3 rounded-2xl border-(--cinza-300) p-2">
                    <ParagraphSmall>Links Adicionais</ParagraphSmall>
                    {detalhesReuniao?.links
                        ?.filter((link) => link.tipo_link === 'link_adicional')
                        .map((link) => (
                            <div key={link.id} className="flex pl-2 text-(--color-base) underline">
                                <button>
                                    <ParagraphSmall>{link.nome}</ParagraphSmall>
                                </button>
                                <IconButton
                                    className="bg-transparent hover:bg-(--roxo-light) "
                                    icon={<Trash2 className="text-black w-4 h-4 " />}
                                ></IconButton>
                            </div>
                        ))}

                    <div className="w-full flex items-center p-1 justify-center">
                        <IconButton className="w-29 hover:bg-(--color-dark)">
                            Adicionar link
                        </IconButton>
                    </div>
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
                                        className="w-10"
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
                                    <IconButton
                                        className="bg-transparent flex "
                                        icon={<EllipsisVertical className="text-black w-4" />}
                                    ></IconButton>
                                </div>
                            </div>
                        ))}
                        <div className="w-full p-2 items-center justify-center flex">
                            <IconButton className="hover:bg-(--color-dark)">
                                Novo Participante
                            </IconButton>
                        </div>
                    </div>
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
                                    {convidado.cargo} (Convidado)
                                </ParagraphSmall>
                                <IconButton
                                    className="bg-transparent flex "
                                    icon={<EllipsisVertical className="text-black w-4" />}
                                ></IconButton>
                            </div>
                        </div>
                    ))}
                    <div className="w-full p-2 items-center justify-center flex">
                        <IconButton className="hover:bg-(--color-dark)">Novo Convidado</IconButton>
                    </div>
                </div>
                <div className="flex items-center w-full justify-center p-2"></div>
            </div>
        </div>
    );
}

export default DetailsMeeting;
