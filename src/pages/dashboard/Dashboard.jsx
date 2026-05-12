import MobileHeader from '../../components/MobileHeader.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import QuickAccessListHorizontal from './components/QuickAccessListHorizontal.jsx';
import InviteList from './components/InviteList.jsx';
import { getDashboard } from '../../services/api.js';
import { useEffect, useState } from 'react';

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
    });

    return (
        <div className="bg-(--fundo)">
            <MobileHeader></MobileHeader>
            <main className="flex flex-col gap-3 px-4 py-3">
                <Title2 className="text-(--cinza-700)">Continue de onde parou</Title2>
                <QuickAccessListHorizontal documentos={documentos}></QuickAccessListHorizontal>

                <Title2 className="text-(--cinza-700)">Convites</Title2>
                <InviteList convites={convites}></InviteList>
            </main>
        </div>
    );
}
export default Dashboard;
