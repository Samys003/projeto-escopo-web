import { ChevronRight } from 'lucide-react';
import MobileHeader from '../../components/MobileHeader';
import ParagraphSmall from '../../components/Typography/ParagraphSmall';
import Title2 from '../../components/Typography/Title2';
import Title4 from '../../components/Typography/Title4';
import { getProjects } from '../../services/api';
import { useEffect, useState } from 'react';
import Project from './components/Project';

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
    });

    return (
        <div>
            <MobileHeader></MobileHeader>

            <main className="p-3 flex flex-col gap-3">
                <Title2 className="text-(--cinza-700)">Lista de Projetos</Title2>

                <div className="grid grid-cols-2 gap-2.5">
                    {projetos.map((projeto) => (
                        <Project key={projeto.id} projeto={projeto}></Project>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default ProjectList;
