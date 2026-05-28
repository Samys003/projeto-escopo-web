import MobileHeader from '../../components/MobileHeader';
import Title2 from '../../components/Typography/Title2';
import Title4 from '../../components/Typography/Title4';
// import { getProjects } from '../../services/api';
import { getProjects } from './services/project-list-endpoints';
import { useEffect, useState } from 'react';
import Project from './components/Project';
import { Plus } from 'lucide-react';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import { Link } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSideBar';

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
        <div className="lg:flex">
            <MobileHeader></MobileHeader>
            <DesktopSidebar></DesktopSidebar>

            <main
                className="p-3 flex flex-col gap-3 overflow-y-auto 
            lg:gap-14 lg:px-10 lg:py-8"
            >
                <Title2
                    className="text-(--cinza-700) 
                lg:text-[32px] lg:font-bold"
                >
                    Lista de Projetos
                </Title2>

                <div className="flex flex-col items-center gap-3 ">
                    <Link to={`/novo-projeto`} className="lg:hidden">
                        <div className="flex w-fit px-7 py-2 shadow-(--external-shadow) justify-center rounded-lg">
                            <Plus className="text-(--cinza-700)"></Plus>
                            <ParagraphMedium className="text-(--cinza-700) font-semibold">
                                Novo Projeto
                            </ParagraphMedium>
                        </div>
                    </Link>
                    <div
                        className="grid grid-cols-2 gap-2.5 justify-between
                        lg:grid-cols-3 lg:gap-10"
                    >
                        <Link className="hidden lg:flex" to={`/novo-projeto`}>
                            <div
                                className="hidden w-full h-[200px] px-4 py-3 gap-3
                                rounded-lg shadow-(--external-shadow) items-center justify-center
                                lg:flex"
                            >
                                <Plus className="text-(--cinza-500)"></Plus>
                                <Title4 className="text-(--cinza-500) text-2xl font-semibold">
                                    Novo Projeto
                                </Title4>
                            </div>
                        </Link>

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
