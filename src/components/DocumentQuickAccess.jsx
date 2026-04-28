import iconFolder from '../assets/icons/icon-folder.svg'
import { ChevronRightIcon } from 'lucide-react'
import Title4 from './Typography/Title4'
import ParagraphMedium from './Typography/ParagraphMedium'

function DocumentQuickAccess() {
    return (
        <div className='grid gap-[10px] p-3 w-[196px] border-(--cinza-300) border-[2px]  rounded-xl'>
            <div className='flex gap-3 items-center'>
                <img src={iconFolder} alt="" />
                <ChevronRightIcon className="text-(--cinza-700)" />
            </div>
            <div className='gap-0'>
                <Title4>Projeto Integrado</Title4>
                <ParagraphMedium className= "text-(--cinza-500)">Página Web</ParagraphMedium>
                <ParagraphMedium className= "text-(--cinza-500)">Requisitos Funcionais</ParagraphMedium>
            </div>

        </div>
    )
}

export default DocumentQuickAccess