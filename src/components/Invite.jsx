import ParagraphMedium from "./Typography/ParagraphMedium"

function Invite(props){
    const convite = props.convite
    console.log(convite)
    return(
        <div className="bg-white py-[16px] px-4 shadow-(--external-shadow) rounded-xl">
            <ParagraphMedium>{convite.nome_remetente} te convidou para participar do(a) {convite.nome_projeto}.</ParagraphMedium>
        </div>
    )
}

export default Invite