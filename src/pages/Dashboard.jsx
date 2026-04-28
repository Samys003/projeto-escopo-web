import MobileHeader from "../components/MobileHeader.jsx";
import Title2 from "../components/Typography/Title2.jsx";
import ProjectListHorizontal from "../components/ProjectListHorizontal.jsx";
import DailyInvitationsList from "../components/DailyInvitationsList.jsx";

function Dashboard() {
    return (
        <div className="bg-[var(--fundo)]">
            <MobileHeader></MobileHeader>
            <main className="flex flex-col gap-[12px] px-[16px] py-[12px]">
                <Title2 className="text-[var(--cinza-700)]">Continue de onde parou</Title2>
                <ProjectListHorizontal></ProjectListHorizontal>
                <Title2 className="text-[var(--cinza-700)]">Convites</Title2>

                <DailyInvitationsList></DailyInvitationsList>
                <DailyInvitationsList></DailyInvitationsList>
                <DailyInvitationsList></DailyInvitationsList>
            </main>
        </div>
    )
}
export default Dashboard