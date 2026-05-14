import MobileHeader from '../../components/MobileHeader';
import Title2 from '../../components/Typography/Title2';
// import { getProjects } from '../../services/api';
import { getProjects } from './services/project-list-endpoints';
import { useEffect, useState } from 'react';
import Project from './components/Project';
import { Plus } from 'lucide-react';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import { Link } from 'react-router-dom';

function ProjectList() {
    const [projetos, setProjetos] = useState([]);

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await getProjects();
                setProjetos(data);
            } catch (error) {
                console.error(error);
            }
        }
        loadProjects();
    }, []);

    return (
        <div>
            <MobileHeader></MobileHeader>

            <main className="p-3 flex flex-col gap-3">
                <Title2 className="text-(--cinza-700)">Lista de Projetos</Title2>

                <div className="flex flex-col items-center gap-3 ">
                    <Link to={`/novo-projeto`}>
                        <div className="flex w-fit px-7 py-2 shadow-(--external-shadow) justify-center rounded-lg">
                            <Plus className="text-(--cinza-700)"></Plus>
                            <ParagraphMedium className="text-(--cinza-700) font-semibold">
                                Novo Projeto
                            </ParagraphMedium>
                        </div>
                    </Link>
                    <div className="grid grid-cols-2 gap-2.5 justify-between">
                        {projetos.map((projeto) => (
                            <Project key={projeto.id} projeto={projeto}></Project>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
export default ProjectList;
