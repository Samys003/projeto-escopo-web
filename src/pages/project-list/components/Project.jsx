import { ChevronRight } from 'lucide-react';
import ParagraphSmall from '../../../components/Typography/ParagraphSmall';
import Title2 from '../../../components/Typography/Title2';
import Title4 from '../../../components/Typography/Title4';

function Project({ projeto }) {
    return (
        <div className="p-2 rounded-lg w-[180px] shadow-(--external-shadow)">
            <Title4 className="text-(--cinza-600)">{projeto.titulo}</Title4>
            <div className="flex items-center">
                <ParagraphSmall className="line-clamp-3 text-(--cinza-400) ">
                    {projeto.descricao}
                </ParagraphSmall>
                <ChevronRight className="w-6 h-6 shrink-0"></ChevronRight>
            </div>
            <div className="flex -space-x-2">
                {projeto.foto_usuarios.map((foto) =>
                    foto ? (
                        <img src={foto} alt="" className="w-6 h-6 rounded-full bg-red-500" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-(--cinza-300) border-[0.2px] border-white"></div>
                    ),
                )}
            </div>
        </div>
    );
}
export default Project;
