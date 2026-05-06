import MobileHeader from "../../components/MobileHeader.jsx";
import Title2 from "../../components/Typography/Title2.jsx";
import QuickAccessListHorizontal from "./components/QuickAccessListHorizontal.jsx";
import InviteList from "./components/InviteList.jsx";

function Dashboard() {
    const documentos = [
        { id: 1, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial" },
        { id: 2, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial" },
        { id: 3, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial" },
        { id: 4, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial" },
        { id: 5, projeto: "Meu Projeto", categoria: "Documentação", documento: "Página Inicial" }
    ]
    
    const convites = [
        { id: 1, nome_remetente: "Bruno Dias", nome_projeto: "Projeto Integrado", criado_em: "2026-04-14 09:34", status: {id: 1, nome: "pendente"}, },
        { id: 2, nome_remetente: "Ana Paula", nome_projeto: "Revisão Anual", criado_em: "2026-04-14 09:34", status: {id: 1, nome: "recusado"}, },
        { id: 3, nome_remetente: "Manuel Gomes", nome_projeto: "Meu Projeto", criado_em: "2026-04-13 09:34", status: {id: 4, nome: "não-lido"}, },
        { id: 4, nome_remetente: "Ana Paula", nome_projeto: "Projeto Integrado", criado_em: "2026-04-15 09:34", status: {id: 1, nome: "pendente"}, },
    ]

return (
    <div className="bg-[var(--fundo)]">
        <MobileHeader></MobileHeader>
        <main className="flex flex-col gap-[12px] px-[16px] py-[12px]">
            <Title2 className="text-[var(--cinza-700)]">Continue de onde parou</Title2>
            <QuickAccessListHorizontal documentos={documentos}></QuickAccessListHorizontal>
            
            <Title2 className="text-[var(--cinza-700)]">Convites</Title2>
            <InviteList convites = {convites}></InviteList>
        </main>
    </div>
)
}
export default Dashboard