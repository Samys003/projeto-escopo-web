import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ParagraphSmall from '../../../components/Typography/ParagraphSmall';
import Title4 from '../../../components/Typography/Title4';

function Project({ projeto }) {
    return (
        <Link to={`/projeto/${projeto.id}`}>
            <div
                className="flex flex-col w-full h-[120px] p-2
                rounded-lg shadow-(--external-shadow) justify-between
                lg:h-[200px] lg:px-4 lg:py-3
            
                transition-all duration-200 ease-out
                hover:scale-105 hover:-translate-y-1
                hover:shadow-lg"
            >
                <Title4
                    className="text-(--cinza-600)
                    lg:text-2xl lg:font-semibold
                "
                >
                    {projeto.titulo}
                </Title4>
                <div
                    className="flex items-center 
                    lg:h-full lg:items-start"
                >
                    <ParagraphSmall
                        className="line-clamp-3 text-(--cinza-400) w-full
                        lg:text-base"
                    >
                        {projeto.descricao}
                    </ParagraphSmall>
                    <ChevronRight
                        className="w-6 h-6 shrink-0
                        lg:hidden"
                    ></ChevronRight>
                </div>
                <div className="flex -space-x-2">
                    {projeto.foto_usuarios.map((foto) =>
                        foto ? (
                            <img
<<<<<<< integracao-tela-documentacao
                                key={foto}
=======
                                key={index}
>>>>>>> development
                                src={foto}
                                alt=""
                                className="w-6 h-6 rounded-full bg-red-500
                                lg:w-10 lg:h-10"
                            />
                        ) : (
                            <div
<<<<<<< integracao-tela-documentacao
                                key={foto}
=======
                                key={index}
>>>>>>> development
                                className="w-6 h-6 rounded-full bg-(--cinza-300) border-[0.2px] border-white
                                lg:w-10 lg:h-10"
                            ></div>
                        ),
                    )}
                </div>
            </div>
        </Link>
    );
}
export default Project;
