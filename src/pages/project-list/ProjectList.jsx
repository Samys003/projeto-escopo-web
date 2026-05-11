import { ChevronRight } from 'lucide-react';
import MobileHeader from '../../components/MobileHeader';
import ParagraphSmall from '../../components/Typography/ParagraphSmall';
import Title2 from '../../components/Typography/Title2';
import Title4 from '../../components/Typography/Title4';

function ProjectList() {
    return (
        <div>
            <MobileHeader></MobileHeader>

            <main className="p-3">
                <Title2 className="text-(--cinza-700)">Lista de Projetos</Title2>

                {/* Projeto*/}
                <div className="p-2 rounded-lg w-[180px] shadow-(--external-shadow)">
                    <Title4 className="text-(--cinza-600)">Projeto Integrado</Title4>
                    <div className="flex">
                        <ParagraphSmall className="text-(--cinza-400)">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                        </ParagraphSmall>
                        <ChevronRight></ChevronRight>
                    </div>
                    <div></div>
                </div>
            </main>
        </div>
    );
}
export default ProjectList;
