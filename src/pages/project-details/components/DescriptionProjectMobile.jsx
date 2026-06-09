import Title2 from '../../../components/Typography/Title2';
import IconButton from '../../../components/IconButton';
import { SquarePen, ChevronUp, ChevronDown } from 'lucide-react';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function DescriptionProjectMobile({ project, expand, setExpand, onClick }) {
    return (
        <div className="lg:hidden w-full flex flex-col p-2">
            <div className="w-full flex items-center gap-2 ">
                <Title2 className="text-2xl">{project?.titulo}</Title2>
                <IconButton
                    onClick={onClick}
                    icon={<SquarePen />}
                    className={`hover:bg-(--color-dark) ${project?.nivel_acesso_id === 1 ? '' : 'hidden'}`}
                ></IconButton>
            </div>
            <div className="w-full flex flex-col  gap-2">
                <div className="">
                    <ParagraphMedium>
                        Status: {project?.status ? 'Em andamento' : 'Concluido'}
                    </ParagraphMedium>
                </div>
                <div
                    className={` flex  ${!expand ? 'items-end justify-between' : 'flex-col gap-2'} `}
                >
                    <ParagraphMedium className={!expand ? 'line-clamp-2' : ''}>
                        Descrição: {project?.descricao}
                    </ParagraphMedium>
                    {expand && (
                        <div className=" flex justify-between items-end w-full">
                            <div>
                                <ParagraphMedium>
                                    Data de Criação:{' '}
                                    {new Date(project?.data_criacao).toLocaleDateString()}
                                </ParagraphMedium>
                                <ParagraphMedium>
                                    Ultima Alteração:{' '}
                                    {new Date(project?.ultima_atualizacao).toLocaleDateString()}
                                </ParagraphMedium>
                                <ParagraphMedium>
                                    Responsavel: {project?.nome_responsavel}
                                </ParagraphMedium>
                            </div>
                            <button
                                className="text-(--color-base)"
                                onClick={() => setExpand(false)}
                            >
                                <ChevronUp />
                            </button>
                        </div>
                    )}
                    {!expand && (
                        <button className="text-(--color-base)" onClick={() => setExpand(true)}>
                            <ChevronDown />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DescriptionProjectMobile;
