import Title4 from '../../../components/Typography/Title4.jsx';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium.jsx';
import iconFolder from '../../../assets/icons/icon-folder.svg';

function EmptyRecentsMessage() {
    return (
        <div className="flex border-[2px] py-2 px-3 border-(--cinza-300) rounded-xl bg-white">
            <div className="flex flex-col justify-between">
                <Title4 className="font-medium text-(--cinza-700)">Sem atividade recente</Title4>
                <div>
                    <ParagraphMedium className="text-(--cinza-500)">
                        As últimas atividades realizadas em documentos aparecerão aqui.
                    </ParagraphMedium>
                </div>
            </div>
            <div className="py-2">
                <img src={iconFolder} alt="" className="opacity-50 h-full" />
            </div>
        </div>
    );
}

export default EmptyRecentsMessage;
