import MobileHeader from '../../components/MobileHeader.jsx';
import DesktopSidebar from '../../components/DesktopSideBar.jsx';
import { getDashboard, answerInvite } from './services/dashboard-endpoints.js';
import { useEffect, useState } from 'react';
import iconFolder from '../../assets/icons/icon-folder.svg';

import Title2 from '../../components/Typography/Title2.jsx';
import Title4 from '../../components/Typography/Title4.jsx';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium.jsx';
import { formatDate } from '../../utils/formatters';

import DocumentQuickAccess from './components/DocumentQuickAccess.jsx';
import Invite from './components/Invite';

function Dashboard() {
    const [documentos, setDocumentos] = useState([]);
    const [convites, setConvites] = useState([]);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data = await getDashboard();

                setDocumentos(data.documentos);
                setConvites(data.convites);
            } catch (error) {
                console.error(error);
            }
        }
        loadDashboard();
    }, []);

    //TODO: Criar uma função model, ordenar por data também pode ser utilizado em notificações
    const convitesOrdenados = [];
    convites.forEach((convite) => {
        const dia = convite.criado_em.split('T')[0];

        if (!convitesOrdenados[dia]) {
            //caso não exista uma data correspondente no novo array, ele cria
            convitesOrdenados[dia] = [];
        }

        //Adicionando convite a data correspondente
        convitesOrdenados[dia].push(convite);
    });

    async function handleAnswerInvite(conviteId, statusId) {
        try {
            await answerInvite(conviteId, statusId);

            //Removendo convite da lista
            setConvites((prev) => prev.filter((convite) => convite.id !== conviteId));
        } catch (error) {}
    }

    return (
        <div
            className="h-screen
        bg-(--fundo) 
        lg:flex
        "
        >
            <MobileHeader></MobileHeader>
            <DesktopSidebar></DesktopSidebar>
            <main
                className="flex flex-col gap-3 px-4 py-3 overflow-y-auto
            lg:gap-10 lg:px-12 lg:py-8"
            >
                <Title2
                    className="text-(--cinza-700)
                lg:text-3xl"
                >
                    Continue de onde parou
                </Title2>

                <div
                    className="overflow-x-auto border-b border-(--cinza-500) pb-3
                lg:pb-4"
                >
                    <div className="flex gap-[10px] w-max">
                        {documentos?.length > 0 ? (
                            documentos.map((documento) => (
                                <DocumentQuickAccess
                                    key={documento.id}
                                    documento={documento}
                                ></DocumentQuickAccess>
                            ))
                        ) : (
                            <div>
                                <div>
                                    <Title4 className="font-medium text-(--cinza-700)">
                                        Sem atividade recente
                                    </Title4>
                                    <ParagraphMedium>
                                        As últimas atividades realizadas em documentos aparecerão
                                        aqui.
                                    </ParagraphMedium>
                                </div>
                                <img src={iconFolder} alt="" className="opacity-50" />
                            </div>
                        )}
                    </div>
                </div>

                <Title2 className="text-(--cinza-700)">Convites</Title2>
                <div className="flex flex-col gap-[10px]">
                    {Object.entries(convitesOrdenados).map(([data, convitesDia]) => (
                        <div key={data} className="flex flex-col gap-[10px]">
                            <ParagraphLarge className="text-(--cinza-700) lg:hidden">
                                {formatDate(data)}
                            </ParagraphLarge>
                            {convitesDia.map((convite) => (
                                <Invite
                                    key={convite.id}
                                    convite={convite}
                                    onAnswerInvite={handleAnswerInvite}
                                ></Invite>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default Dashboard;
