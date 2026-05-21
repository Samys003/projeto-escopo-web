import { ChevronsLeft, SquarePen } from 'lucide-react';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDetailsMeetingById } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Title2 from '../../components/Typography/Title2';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title3 from '../../components/Typography/Title3';

function DetailsMeeting() {
    const { id } = useParams();

    const [detalhesReuniao, setDetalhesReuniao] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarReuniao() {
            try {
                const data = await getDetailsMeetingById(id);

                console.log(data);

                setDetalhesReuniao(data);
            } catch (error) {
                console.error(error);
            }
        }

        carregarReuniao();
    }, [id]);

    return (
        <div className="w-full lg:flex ">
            <DesktopSidebar></DesktopSidebar>
            <MobileHeader></MobileHeader>
            <div className="flex gap-2 lg:items-start p-1 border-b m-2">
                <button>
                    <ChevronsLeft
                        onClick={() => navigate(`/projeto/${detalhesReuniao.projeto_id}`)}
                        className="w-9 h-9"
                    />
                </button>
                <div className="flex w-full pb-2 items-center justify-between">
                    <div className="flex flex-col ">
                        <Title2 className="font-bold leading-none">{detalhesReuniao.titulo}</Title2>
                        <ParagraphMedium className="text-(--cinza-500)">
                            {'Realizado em: '}
                            {new Date(detalhesReuniao?.criado_em).toLocaleDateString()}
                        </ParagraphMedium>
                    </div>
                </div>
                <button>
                    <SquarePen className="w-6 h-9" />
                </button>
            </div>
        </div>
    );
}

export default DetailsMeeting;
