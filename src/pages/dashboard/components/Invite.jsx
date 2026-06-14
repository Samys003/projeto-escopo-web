import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import IconButtonOutlined from '../../../components/IconButtonOutlined';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';

function Invite(props) {
    const convite = props.convite;
    const data = convite.criado_em.split('T')[0];
    const message =
        convite.status.id === 1
            ? `${convite.nome_remetente} te enviou um convite para participar do(a) ${convite.projeto}.`
            : `${convite.nome_remetente} aceitou seu convite para participar do(a) ${convite.projeto}.`;
    return (
        <div
            className="py-4 px-4 border-[2px] border-(--cinza-300) 
            rounded-xl gap-6 bg-white  
            flex justify-between"
        >
            <div className="flex-4">
                <ParagraphMedium>{message}.</ParagraphMedium>
            </div>
            {/* Interação com o convite */}
            {convite.status.id === 1 ? (
                <div className="flex-1 flex justify-between items-center">
                    {/* Check para rejeitar o convite (Id 6)*/}
                    <IconButtonOutlined
                        className="aspect-square flex-2"
                        icon={<Check className="text-(--color-verde)" />}
                        onClick={() => props.onAnswerInvite(convite.id, 6)}
                    />

                    {/* X para rejeitar o convite (Id 2)*/}
                    <IconButtonOutlined
                        icon={<X className="text-(--color-alert)" />}
                        onClick={() => props.onAnswerInvite(convite.id, 2)}
                    />
                </div>
            ) : convite.status.id === 4 ? (
                <IconButtonOutlined
                    icon={<Check className="text-(--color-verde)" />}
                    onClick={() => props.onAnswerInvite(convite.id, 5)}
                />
            ) : null}

            <ParagraphMedium
                className="hidden text-(--cinza-500)
                lg:inline"
            >
                {formatDate(data)}
            </ParagraphMedium>
        </div>
    );
}
export default Invite;
