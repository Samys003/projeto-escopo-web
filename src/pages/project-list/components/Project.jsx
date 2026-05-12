import { ChevronRight } from 'lucide-react';
import ParagraphSmall from '../../../components/Typography/ParagraphSmall';
import Title2 from '../../../components/Typography/Title2';
import Title4 from '../../../components/Typography/Title4';

function Project({ projeto }) {
    const fotosUsuarios = projeto.foto_usuarios?.split(',');
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
                {fotosUsuarios.map((foto) => (
                    <img src={foto} alt="" className="w-6 h-6 rounded-full" />
                ))}
            </div>
        </div>
    );
}
export default Project;
