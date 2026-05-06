import ParagraphMedium from "../../../components/Typography/ParagraphMedium";
import IconButtonOutlined from "../../../components/IconButtonOutlined";
import { Check } from "lucide-react";

 
function Invite(props){
    const convite = props.convite
    console.log(convite)
    return(
        <div className="bg-white py-[16px] px-4 shadow-(--external-shadow) rounded-xl flex">
            <ParagraphMedium className = "">{convite.nome_remetente} te convidou para participar do(a) {convite.nome_projeto}.</ParagraphMedium>
            <IconButtonOutlined icon ={<Check className="text-(--color-verde)" />} ></IconButtonOutlined>
        </div>
    )
}

export default Invite