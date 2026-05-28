import { Check, Circle, Lightbulb, Plus, X } from 'lucide-react';
import { useState } from 'react';
import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import ParagraphSmall from '../../../components/Typography/ParagraphSmall';
import Title2 from '../../../components/Typography/Title2';
import logotipoMobile from '../../../assets/logotipo-mobile.svg';

function SugestaoCard({ sugestao, onAlternarStatus }) {
    const concluida = sugestao.status === 'concluida';

    return (
        <article className="rounded-lg border border-[var(--cinza-300)] bg-white p-4">
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={() => onAlternarStatus(sugestao.id)}
                    className="mt-1 shrink-0 text-[var(--color-base)]"
                    aria-label={concluida ? 'Marcar sugestão como pendente' : 'Concluir sugestão'}
                >
                    {concluida ? <Check size={22} strokeWidth={2.4} /> : <Circle size={22} />}
                </button>

                <div className="min-w-0 flex-1">
                    <ParagraphLarge
                        className={`break-words font-medium [overflow-wrap:anywhere] ${
                            concluida ? 'text-[var(--cinza-500)] line-through' : 'text-black'
                        }`}
                    >
                        {sugestao.titulo}
                    </ParagraphLarge>
                    <ParagraphMedium className="mt-2 break-words text-[var(--cinza-600)] [overflow-wrap:anywhere]">
                        {sugestao.descricao}
                    </ParagraphMedium>
                    <ParagraphSmall className="mt-3 text-[var(--cinza-500)]">
                        {sugestao.origem}
                    </ParagraphSmall>
                </div>
            </div>
        </article>
    );
}

function CampoSugestao({ valor, onChange, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="flex items-end gap-2">
            <textarea
                value={valor}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-20 flex-1 resize-none rounded-lg border border-[var(--cinza-300)] px-3 py-2 font-inter text-[14px] text-black outline-none placeholder:text-[var(--cinza-500)] focus:border-[var(--color-base)]"
                placeholder="Nova sugestão"
                aria-label="Nova sugestão"
            />
            <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)]"
                aria-label="Adicionar sugestão"
            >
                <Plus size={22} />
            </button>
        </form>
    );
}

function ListaSugestoes({ sugestoes, onAlternarStatus }) {
    if (sugestoes.length === 0) {
        return (
            <ParagraphMedium className="text-[var(--cinza-500)]">
                Nenhuma sugestão registrada.
            </ParagraphMedium>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {sugestoes.map((sugestao) => (
                <SugestaoCard
                    key={sugestao.id}
                    sugestao={sugestao}
                    onAlternarStatus={onAlternarStatus}
                />
            ))}
        </div>
    );
}

function Sugestao({ sugestoes, onFechar, onAdicionarSugestao, onAlternarStatus }) {
    const [texto, setTexto] = useState('');

    function enviarSugestao(event) {
        event.preventDefault();

        if (!texto.trim()) {
            return;
        }

        onAdicionarSugestao(texto.trim());
        setTexto('');
    }

    const campo = (
        <CampoSugestao valor={texto} onChange={setTexto} onSubmit={enviarSugestao} />
    );

    return (
        <>
            <aside className="fixed bottom-0 right-0 top-0 z-50 hidden w-[430px] flex-col border-l border-[var(--cinza-300)] bg-white shadow-[var(--external-shadow)] lg:flex">
                <header className="px-5 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <Lightbulb
                                className="shrink-0 text-[var(--color-base)]"
                                size={28}
                            />
                            <Title2 className="truncate text-[26px] text-[var(--cinza-700)]">
                                Sugestões
                            </Title2>
                        </div>
                        <button type="button" onClick={onFechar} aria-label="Fechar sugestões">
                            <X className="text-[var(--cinza-700)]" size={26} />
                        </button>
                    </div>
                    <div className="mt-2 border-b border-[var(--cinza-700)]" />
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-8">
                    <ListaSugestoes
                        sugestoes={sugestoes}
                        onAlternarStatus={onAlternarStatus}
                    />
                </div>

                <footer className="border-t border-[var(--cinza-700)] px-4 py-3">{campo}</footer>
            </aside>

            <section className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
                <header className="flex h-[50px] items-center justify-between bg-[var(--color-base)] px-4">
                    <img src={logotipoMobile} alt="Escopo" className="h-auto w-40" />
                    <button type="button" onClick={onFechar} aria-label="Fechar sugestões">
                        <X className="text-white" size={26} />
                    </button>
                </header>

                <div className="border-b border-[var(--cinza-300)] px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="text-[var(--color-base)]" size={26} />
                        <Title2 className="text-[24px] text-[var(--cinza-700)]">Sugestões</Title2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <ListaSugestoes
                        sugestoes={sugestoes}
                        onAlternarStatus={onAlternarStatus}
                    />
                </div>

                <footer className="border-t border-[var(--cinza-300)] px-4 py-3">{campo}</footer>
            </section>
        </>
    );
}

export default Sugestao;
