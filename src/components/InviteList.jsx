import Invite from "./Invite"
import ParagraphLarge from "./Typography/ParagraphLarge";
import { formatDate } from "../utils/formatters";

function InviteList(props) {

    //TODO: Criar uma função model, ordenar por data também pode ser utilizado em notificações
    const convites = props.convites
    const convitesOrdenados = []
    convites.forEach((convite) => {
        const dia = convite.criado_em.split(" ")[0];

        if (!convitesOrdenados[dia]) {
            //caso não exista uma data correspondente no novo array, ele cria
            convitesOrdenados[dia] = [];
        }

        //Adicionando convite a data correspondente
        convitesOrdenados[dia].push(convite)
    })


    return (
        <div className="flex flex-col gap-[10px]">
            {Object.entries(convitesOrdenados).map(([data, convitesDia]) => (
                <div key={data} className="flex flex-col gap-[10px]">
                    <ParagraphLarge className="text-(--cinza-700)">{formatDate(data)}</ParagraphLarge>
                {convitesDia.map((convite) => (
                    <Invite convite={convite}></Invite>
                ))}
                </div>
            ))}
        </div>
    )

    // convitesOrdenados.map((convitesDia) => {
    //     console.log(convitesDia)
    //     // <ParagraphLarge className="text-(--cinza-700)">{convitesDia[0].criado_em}</ParagraphLarge>
    // })
    // <ParagraphLarge className="text-(--cinza-700)">17/03/2026</ParagraphLarge>
    //         <Invite></Invite>
    //         <Invite></Invite>
    //         <Invite></Invite> 

    // <div className="flex gap-[10px] w-max">
    //         {documentos.map((documento) =>(
    //             <DocumentQuickAccess documento = {documento}></DocumentQuickAccess>
    //         ))}
    //     </div>}


}

export default InviteList