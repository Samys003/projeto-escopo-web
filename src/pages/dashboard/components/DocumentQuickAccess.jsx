import iconFolder from '../../../assets/icons/icon-folder.svg';
import { ChevronRightIcon } from 'lucide-react';
import Title4 from '../../../components/Typography/Title4';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function DocumentQuickAccess(props) {
    const documento = props.documento;

    // TODO: Onclick com o id ainda não feito, inserir ao completar a tela de documento
    return (
        <div
            className="grid gap-[10px] p-3 w-[196px] border-(--cinza-300) border-[2px] rounded-xl overflow-hidden
        lg:w-[352px] lg:h-min lg:max-h-23 lg:px-8 lg:py-2 lg:gap-0"
        >
            <div className="flex gap-3 items-center lg:hidden">
                <img src={iconFolder} alt="" className="" />
                <ChevronRightIcon className="text-(--cinza-700)" />
            </div>
            <div className="gap-0 min-w-0">
                <Title4 className="lg:text-xl">{documento.projeto}</Title4>
                <ParagraphMedium
                    className="text-(--cinza-500)
                    lg:text-base"
                >
                    {documento.categoria}:
                </ParagraphMedium>
                <ParagraphMedium
                    className="text-(--cinza-500) 
                lg:text-base truncate"
                >
                    {documento.documento}
                </ParagraphMedium>
            </div>
        </div>
    );
}

export default DocumentQuickAccess;
