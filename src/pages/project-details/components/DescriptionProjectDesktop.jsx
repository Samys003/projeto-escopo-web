import Title2 from '../../../components/Typography/Title2';
import IconButton from '../../../components/IconButton';
import { SquarePen } from 'lucide-react';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function DescriptionProjectDesktop({ project, onClick }) {
    return (
        <div className="lg:flex hidden w-full justify-between">
            <div className="w-[50%]">
                <div className="flex items-center justify-between w-full mb-2">
                    <Title2 className="text-2xl text-(--cinza-700">{project?.titulo}</Title2>
                    <IconButton
                        onClick={onClick}
                        icon={<SquarePen />}
                        className={`hover:bg-(--color-dark) ${project?.nivel_acesso_id === 1 ? '' : 'hidden'} cursor-pointer`}
                    ></IconButton>
                </div>
                <div className="w-full flex flex-col  gap-2  mb-4">
                    <ParagraphMedium className="text-(--cinza-700)">
                        Status: {project?.status ? 'Em andamento' : 'Concluido'}
                    </ParagraphMedium>
                    <ParagraphMedium className="text-(--cinza-700)">
                        Descrição: {project?.descricao}
                    </ParagraphMedium>
                </div>
            </div>
            <div className="flex flex-col  items-start w-[25%] justify-start pt-3">
                <ParagraphMedium className="text-(--cinza-700)">
                    Data de Criação: {new Date(project?.data_criacao).toLocaleDateString()}
                </ParagraphMedium>
                <ParagraphMedium className="text-(--cinza-700)">
                    Ultima Alteração:{' '}
                    {new Date(
                        project?.ultima_atualizacao || project?.data_criacao,
                    ).toLocaleDateString()}
                </ParagraphMedium>
                <ParagraphMedium className="text-(--cinza-700)">
                    Responsavel: {project?.nome_responsavel}
                </ParagraphMedium>
            </div>
        </div>
    );
}

export default DescriptionProjectDesktop;
