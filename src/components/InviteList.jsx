import Invite from "./Invite"
import ParagraphLarge from "./Typography/ParagraphLarge";

function InviteList(props){
    const convites = props.convites
    console.log(convites)

    return(
        <div className="flex flex-col gap-[10px]">
        <ParagraphLarge className= "text-(--cinza-700)">17/03/2026</ParagraphLarge>
        <Invite></Invite>
        <Invite></Invite>
        <Invite></Invite>
    </div>

    )
        
    

}

export default InviteList