import { Check, ChevronsLeft, Menu, Send, X } from 'lucide-react';
import logotipoMobile from '../../../assets/logotipo-mobile.svg';

const comentarios = [
    {
        id: 1,
        nome: 'Carlos Ribeiro',
        cargo: 'Cliente',
        horario: '13:00',
        data: '10.10.2025',
        texto: 'Os requisitos estão alinhados com as minhas ideias no geral, mas faltam mais detalhes',
        avatar: 'CR',
        acoes: true,
    },
    {
        id: 2,
        nome: 'Marcos Santos',
        cargo: 'Desenvolvedor(a)',
        horario: '13:00',
        data: '10.10.2025',
        texto: 'Os requisitos estão ótimos, bom trabalho pessoal!',
        avatar: 'MS',
    },
    {
        id: 3,
        nome: 'Ana Lívia',
        cargo: 'Gerente do Projeto',
        horario: '13:00',
        data: '10.10.2025',
        texto: 'Se atentem quanto aos prazos!',
        avatar: 'AL',
    },
    {
        id: 4,
        nome: 'Larissa Lemos',
        cargo: 'Analista de Requisitos',
        horario: '13:00',
        data: '10.10.2025',
        texto: 'Tive uma dúvida quanto a um requisito, seria mais interessante o cliente ter a opção de fazer uma avaliação, não?',
        avatar: 'LL',
    },
    {
        id: 5,
        nome: 'Carlos Ribeiro',
        cargo: 'Cliente',
        horario: '13:00',
        data: '10.10.2025',
        texto: 'Realmente! Pode implementar!',
        avatar: 'CR',
        resposta: {
            autor: 'Larissa Lemos',
            cargo: 'Analista de Requisitos',
            texto: 'Tive uma dúvida quanto a um requisito, seria mais interessante o cliente ter a opção de fazer uma avaliação, não?',
        },
    },
    {
        id: 6,
        nome: 'Larissa Lemos',
        cargo: 'Analista de Requisitos',
        horario: '13:00',
        data: '10.10.2025',
        texto: 'Foi decidido com o cliente que a aplicação deverá ter um mapa das localizações visitadas',
        avatar: 'LL',
        resposta: {
            autor: 'Sugestão de Requisito',
            cargo: 'Registro 01',
            texto: '',
        },
    },
];

function Avatar({ comentario, className = '' }) {
    return (
        <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--color-base)] font-inter text-[14px] font-semibold text-[var(--color-base)] ${className}`}
        >
            {comentario.avatar}
        </div>
    );
}

function ComentarioCard({ comentario, mobile = false }) {
    return (
        <article className="flex gap-3">
            <Avatar comentario={comentario} className={mobile ? 'h-12 w-12' : ''} />

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-1 font-inter">
                    <span className="font-semibold text-[var(--color-base)]">
                        {comentario.nome}
                    </span>
                    <span className="truncate font-semibold text-[var(--cinza-300)]">
                        {comentario.cargo}
                    </span>
                    {mobile && (
                        <span className="ml-auto shrink-0 text-[12px] text-[var(--cinza-400)]">
                            {comentario.horario} · {comentario.data}
                        </span>
                    )}
                </div>

                <div className="rounded-xl border border-[var(--cinza-600)] px-4 py-2 font-inter text-[14px] leading-5 text-black">
                    {comentario.resposta && (
                        <div className="mb-2 rounded bg-[var(--cinza-200)] px-3 py-2">
                            <div className="mb-1 truncate text-[12px] text-[var(--color-base)]">
                                {comentario.resposta.autor}{' '}
                                <span className="text-[var(--cinza-400)]">
                                    {comentario.resposta.cargo}
                                </span>
                            </div>
                            {comentario.resposta.texto && (
                                <p className="line-clamp-3 text-[12px] leading-4 text-[var(--cinza-700)]">
                                    {comentario.resposta.texto}
                                </p>
                            )}
                        </div>
                    )}

                    <p>{comentario.texto}</p>

                    {!mobile && (
                        <div className="mt-1 text-right text-[14px] text-[var(--cinza-500)]">
                            {comentario.horario} · {comentario.data}
                        </div>
                    )}
                </div>

                {comentario.acoes && (
                    <div className="mt-1 flex justify-end gap-2">
                        {mobile && (
                            <button
                                type="button"
                                className="rounded border border-[var(--cinza-700)] px-2 py-1 font-inter text-[14px] text-black"
                            >
                                Responder
                            </button>
                        )}
                        <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded border border-[var(--cinza-700)] text-[var(--cinza-700)]"
                            aria-label="Concluir comentário"
                        >
                            <Check size={18} />
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

function CampoComentario() {
    return (
        <div className="flex items-center gap-3">
            <Avatar
                comentario={{
                    avatar: 'AL',
                }}
                className="h-12 w-12"
            />
            <label className="relative flex-1">
                <span className="sr-only">Escreva seu comentário</span>
                <input
                    className="h-10 w-full rounded-xl border border-[var(--cinza-600)] bg-white px-4 pr-11 font-inter text-[14px] outline-none placeholder:text-[var(--cinza-500)]"
                    placeholder="Escreva seu comentário"
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-base)]"
                    aria-label="Enviar comentário"
                >
                    <Send size={22} />
                </button>
            </label>
        </div>
    );
}

function Comentarios({ onFechar }) {
    return (
        <>
            <aside className="fixed bottom-0 right-0 top-0 z-50 hidden w-[430px] flex-col border-l border-[var(--cinza-300)] bg-white shadow-[var(--external-shadow)] lg:flex">
                <header className="px-5 pt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-inter text-[26px] font-semibold text-[var(--cinza-700)]">
                            Comentários
                        </h2>
                        <button type="button" onClick={onFechar} aria-label="Fechar comentários">
                            <X className="text-[var(--cinza-700)]" size={26} />
                        </button>
                    </div>
                    <div className="mt-2 border-b border-[var(--cinza-700)]" />
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            className="rounded-full bg-[var(--roxo-light)] px-4 py-1 font-inter text-[14px] text-[var(--roxo-dark)]"
                        >
                            Em aberto
                        </button>
                        <button
                            type="button"
                            className="rounded-full bg-[var(--cinza-200)] px-4 py-1 font-inter text-[14px] text-[var(--cinza-400)]"
                        >
                            Concluídos
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-8">
                    <div className="flex flex-col gap-8">
                        {comentarios.map((comentario) => (
                            <ComentarioCard key={comentario.id} comentario={comentario} />
                        ))}
                    </div>
                </div>

                <footer className="border-t border-[var(--cinza-700)] px-4 py-3">
                    <CampoComentario />
                </footer>
            </aside>

            <section className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
                <header className="flex h-[50px] items-center justify-between bg-[var(--color-base)] px-4">
                    <img src={logotipoMobile} alt="Escopo" className="h-auto w-40" />
                    <button type="button" onClick={onFechar} aria-label="Fechar comentários">
                        <Menu className="text-white" />
                    </button>
                </header>

                <div className="flex items-center gap-1 px-5 py-3">
                    <button
                        type="button"
                        onClick={onFechar}
                        className="text-[var(--cinza-700)]"
                        aria-label="Voltar"
                    >
                        <ChevronsLeft size={30} strokeWidth={3} />
                    </button>
                    <h2 className="font-inter text-[26px] font-semibold text-[var(--cinza-700)]">
                        Comentários
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6">
                    <div className="flex flex-col gap-5">
                        {comentarios
                            .filter((comentario) => comentario.id !== 3)
                            .map((comentario) => (
                                <ComentarioCard
                                    key={comentario.id}
                                    comentario={comentario}
                                    mobile
                                />
                            ))}
                    </div>
                </div>

                <footer className="border-t border-[var(--cinza-700)] px-4 py-3">
                    <CampoComentario />
                </footer>
            </section>
        </>
    );
}

export default Comentarios;
