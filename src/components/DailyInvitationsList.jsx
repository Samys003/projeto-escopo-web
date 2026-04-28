import ParagraphLarge from "./Typography/ParagraphLarge";
import Invitation from "./Invitation";

function DailyInvitationsList(){
    return (
        <div className="flex flex-col gap-[10px]">
            <ParagraphLarge className= "text-(--cinza-700)">17/03/2026</ParagraphLarge>
            <Invitation></Invitation>
            <Invitation></Invitation>
            <Invitation></Invitation>
        </div>
    )
}

export default DailyInvitationsList;