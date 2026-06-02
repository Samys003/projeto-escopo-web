import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import Title2 from '../../components/Typography/Title2';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import { ListCheck } from 'lucide-react';

const projects = [
    { id: 1, label: 'Projeto Integrado', active: true },
    { id: 2, label: 'Projeto Pessoal' },
    { id: 3, label: 'Trabalho Voluntário 2025' },
];

const notifications = Array.from({ length: 7 }, (_, index) => ({
    id: index + 1,
    title: 'Requisitos Funcionais',
    description: 'Sua adição foi aprovada no documento de requisitos da interface Web',
    date: '17/03/2026',
}));

function Notificacoes() {
    return (
        <div className="min-h-screen bg-(--fundo) lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="flex min-h-screen flex-1 flex-col px-4 py-6 lg:px-10 lg:py-20 xl:px-[38px]">
                <section className="mx-auto flex w-full max-w-[1064px] flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <Title2 className="text-[32px] font-bold leading-none text-(--cinza-600)">
                            Notificações
                        </Title2>

                        <div className="flex flex-wrap gap-3">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    type="button"
                                    className={`h-8 rounded-full px-3 text-[16px] leading-none ${
                                        project.active
                                            ? 'bg-(--roxo-light) text-(--roxo-dark)'
                                            : 'bg-(--cinza-200) text-(--cinza-700)'
                                    }`}
                                >
                                    {project.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-[10px]">
                        {notifications.map((notification) => (
                            <article
                                key={notification.id}
                                className="grid min-h-[72px] grid-cols-[52px_1fr] items-center gap-5 rounded-xl border border-(--cinza-300) bg-white px-5 py-4 md:grid-cols-[88px_240px_1fr_112px] md:gap-10 md:px-10 lg:min-h-[73px] lg:rounded-[10px]"
                            >
                                <ListCheck
                                    aria-hidden="true"
                                    className="mx-auto h-10 w-10 text-(--color-verde)"
                                    strokeWidth={2.7}
                                />

                                <ParagraphLarge
                                    as="h3"
                                    className="font-normal text-black md:whitespace-nowrap"
                                >
                                    {notification.title}
                                </ParagraphLarge>

                                <ParagraphMedium className="col-span-2 text-(--cinza-600) md:col-span-1 md:max-w-[430px] md:text-[14px] md:leading-[1.25]">
                                    {notification.description}
                                </ParagraphMedium>

                                <ParagraphMedium className="col-span-2 justify-self-start text-(--cinza-500) md:col-span-1 md:justify-self-end md:text-[14px]">
                                    {notification.date}
                                </ParagraphMedium>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Notificacoes;
