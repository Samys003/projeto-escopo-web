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

const mobileNotificationGroups = [
    { date: '17/03/2026', notifications: notifications.slice(0, 3) },
    { date: '17/03/2026', notifications: notifications.slice(3) },
];

function Notificacoes() {
    return (
        <div className="min-h-screen bg-(--fundo) lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="flex flex-1 flex-col overflow-x-hidden px-[14px] pt-7 pb-8 lg:min-h-screen lg:px-10 lg:py-20 xl:px-[38px]">
                <section className="mx-auto flex w-full max-w-[1064px] flex-col gap-4 lg:mx-0 lg:gap-8">
                    <div className="flex flex-col gap-3 lg:gap-4">
                        <Title2 className="pl-1.5 text-2xl font-bold leading-none text-(--cinza-600) lg:pl-0 lg:text-[32px]">
                            Notificações
                        </Title2>

                        <div className="-mx-[14px] overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
                            <div className="flex w-max gap-3 lg:w-auto lg:flex-wrap">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        aria-pressed={project.active}
                                        className={`h-7 shrink-0 whitespace-nowrap rounded-full px-3 text-[14px] leading-none lg:h-8 lg:text-[16px] ${
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
                    </div>

                    <div className="flex flex-col gap-7 lg:hidden">
                        {mobileNotificationGroups.map((group, groupIndex) => (
                            <section key={`${group.date}-${groupIndex}`} className="flex flex-col">
                                <ParagraphLarge className="mb-2.5 text-(--cinza-600)">
                                    {group.date}
                                </ParagraphLarge>

                                <div className="flex flex-col gap-1.5">
                                    {group.notifications.map((notification) => (
                                        <article
                                            key={notification.id}
                                            className="min-h-[86px] rounded-xl border border-(--cinza-200) bg-white px-[14px] py-[11px] shadow-[0_1px_4px_rgba(0,0,0,0.14)]"
                                        >
                                            <div className="flex items-center gap-2">
                                                <ListCheck
                                                    aria-hidden="true"
                                                    className="h-[30px] w-[30px] shrink-0 text-(--color-verde)"
                                                    strokeWidth={2.7}
                                                />

                                                <ParagraphLarge
                                                    as="h3"
                                                    className="text-[16px] font-normal leading-none text-black"
                                                >
                                                    {notification.title}
                                                </ParagraphLarge>
                                            </div>

                                            <ParagraphMedium className="mt-1 pl-2.5 text-[14px] leading-snug text-(--cinza-600)">
                                                {notification.description}
                                            </ParagraphMedium>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="hidden flex-col gap-[10px] lg:flex">
                        {notifications.map((notification) => (
                            <article
                                key={notification.id}
                                className="grid min-h-[73px] grid-cols-[88px_240px_minmax(0,1fr)_112px] items-center gap-10 rounded-[10px] border border-(--cinza-300) bg-white px-10 py-4"
                            >
                                <ListCheck
                                    aria-hidden="true"
                                    className="mx-auto h-10 w-10 text-(--color-verde)"
                                    strokeWidth={2.7}
                                />

                                <ParagraphLarge
                                    as="h3"
                                    className="font-normal whitespace-nowrap text-black"
                                >
                                    {notification.title}
                                </ParagraphLarge>

                                <ParagraphMedium className="max-w-[430px] text-(--cinza-600) md:text-[14px] md:leading-[1.25]">
                                    {notification.description}
                                </ParagraphMedium>

                                <ParagraphMedium className="justify-self-end text-(--cinza-500) md:text-[14px]">
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
