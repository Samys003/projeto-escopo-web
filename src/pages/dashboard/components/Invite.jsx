import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import IconButtonOutlined from '../../../components/IconButtonOutlined';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';

function Invite(props) {
    const convite = props.convite;
    const data = convite.criado_em.split('T')[0];
    return (
        <div className="bg-white py-4 px-4 shadow-(--external-shadow) rounded-xl flex justify-between">
            <ParagraphMedium className="">
                {convite.nome_remetente} aceitou seu convite para participar do(a) {convite.projeto}
                .
            </ParagraphMedium>

            {/* Interação com o convite */}
            {convite.status.id === 1 ? (
                <div className="flex gap-3">
                    <IconButtonOutlined icon={<Check className="text-(--color-verde)" />} />

                    <IconButtonOutlined icon={<X className="text-(--color-vermelho)" />} />
                </div>
            ) : convite.status.id === 4 ? (
                <IconButtonOutlined icon={<Check className="text-(--color-verde)" />} />
            ) : null}

            <ParagraphMedium className="hidden text-(--cinza-500) lg:inline">
                {formatDate(data)}
            </ParagraphMedium>
        </div>
    );
}
export default Invite;
