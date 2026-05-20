import iconFolder from '../../../assets/icons/icon-folder.svg'
import { ChevronRightIcon } from 'lucide-react'
import Title4 from '../../../components/Typography/Title4'
import ParagraphMedium from '../../../components/Typography/ParagraphMedium'

function DocumentQuickAccess(props) {
    const documento = props.documento

    // TODO: Onclick com o id ainda não feito, inserir ao completar a tela de documento
    return (
        <div className='grid gap-[10px] p-3 w-[196px] border-(--cinza-300) border-[2px]  rounded-xl'>
            <div className='flex gap-3 items-center'>
                <img src={iconFolder} alt="" />
                <ChevronRightIcon className="text-(--cinza-700)" />
            </div>
            <div className='gap-0'>
                <Title4>{documento.projeto}</Title4>
                <ParagraphMedium className="text-(--cinza-500)">{documento.categoria}</ParagraphMedium>
                <ParagraphMedium className="text-(--cinza-500)">{documento.documento}</ParagraphMedium>
            </div>

        </div>
    )
}

export default DocumentQuickAccess
