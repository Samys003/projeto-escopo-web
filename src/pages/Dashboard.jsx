import MobileHeader from "../components/MobileHeader.jsx";
import Title2 from "../components/Typography/Title2.jsx";
import QuickAccessListHorizontal from "../components/QuickAccessListHorizontal.jsx";
import DailyInvitationsList from "../components/DailyInvitationsList.jsx";

function Dashboard() {
    const documentos = [
        {id: 1, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial"},
        {id: 2, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial"},
        {id: 3, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial"},
        {id: 4, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial"},
        {id: 5, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial"}
    ]

    return (
        <div className="bg-[var(--fundo)]">
            <MobileHeader></MobileHeader>
            <main className="flex flex-col gap-[12px] px-[16px] py-[12px]">
                <Title2 className="text-[var(--cinza-700)]">Continue de onde parou</Title2>
                <QuickAccessListHorizontal documentos = {documentos}></QuickAccessListHorizontal>
                <Title2 className="text-[var(--cinza-700)]">Convites</Title2>

                <DailyInvitationsList></DailyInvitationsList>
                <DailyInvitationsList></DailyInvitationsList>
                <DailyInvitationsList></DailyInvitationsList>
            </main>
        </div>
    )
}
export default Dashboard