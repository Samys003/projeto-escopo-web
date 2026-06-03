import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import Title2 from '../../components/Typography/Title2';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import { getApiErrorMessage, getDocumentById } from '../../services/api';
import Notificacao from './components/notificacao';
import { abrirNotificacao, getNotificacoes } from './services/notificacoes-endpoints';

const FILTRO_TODOS = 'todos';

function normalizarResposta(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.notificacoes)) {
        return data.notificacoes;
    }

    return [];
}

function obterDataChave(data) {
    if (!data) {
        return 'sem-data';
    }

    return String(data).split(/[ T]/)[0] || 'sem-data';
}

function formatarData(data) {
    const dataChave = obterDataChave(data);

    if (dataChave === 'sem-data') {
        return 'Sem data';
    }

    const [ano, mes, dia] = dataChave.split('-');

    if (!ano || !mes || !dia) {
        return dataChave;
    }

    return `${dia}/${mes}/${ano}`;
}

function obterDataTempo(data) {
    if (!data) {
        return 0;
    }

    const dataNormalizada = String(data).replace(' ', 'T');
    const tempo = new Date(dataNormalizada).getTime();

    return Number.isNaN(tempo) ? 0 : tempo;
}

function primeiroValor(objeto, campos, fallback = '') {
    for (const campo of campos) {
        if (objeto?.[campo] !== undefined && objeto?.[campo] !== null && objeto?.[campo] !== '') {
            return objeto[campo];
        }
    }

    return fallback;
}

function obterProjetoNotificacao(notificacao) {
    return primeiroValor(notificacao, ['projeto', 'nome_projeto', 'projeto_nome', 'project']);
}

async function enriquecerComDocumentos(notificacoes) {
    const documentosIds = [
        ...new Set(notificacoes.map((notificacao) => notificacao.documento_id).filter(Boolean)),
    ];

    if (documentosIds.length === 0) {
        return notificacoes;
    }

    const documentos = await Promise.all(
        documentosIds.map(async (documentoId) => {
            try {
                const documento = await getDocumentById(documentoId);
                return [documentoId, documento];
            } catch (err) {
                console.error(err);
                return [documentoId, null];
            }
        }),
    );

    const documentoPorId = new Map(documentos);

    return notificacoes.map((notificacao) => {
        const documento = documentoPorId.get(notificacao.documento_id);

        return {
            ...notificacao,
            documentoExiste: notificacao.documento_id ? Boolean(documento) : true,
            titulo: primeiroValor(documento, ['titulo', 'documento'], notificacao.titulo),
            projeto: primeiroValor(
                documento,
                ['projeto', 'nome_projeto', 'projeto_nome'],
                obterProjetoNotificacao(notificacao),
            ),
        };
    });
}

function Notificacoes() {
    const navigate = useNavigate();
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroAtivo, setFiltroAtivo] = useState(FILTRO_TODOS);
    const [notificacaoSemDocumento, setNotificacaoSemDocumento] = useState(null);

    useEffect(() => {
        let ativo = true;

        async function carregarNotificacoes() {
            try {
                setLoading(true);
                setError('');

                const data = await getNotificacoes();
                const notificacoesNormalizadas = normalizarResposta(data);
                const notificacoesEnriquecidas =
                    await enriquecerComDocumentos(notificacoesNormalizadas);

                if (ativo) {
                    setNotificacoes(notificacoesEnriquecidas);
                }
            } catch (err) {
                if (ativo) {
                    setError(getApiErrorMessage(err, 'Não foi possível carregar as notificações.'));
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        carregarNotificacoes();

        return () => {
            ativo = false;
        };
    }, []);

    const notificacoesOrdenadas = useMemo(
        () =>
            [...notificacoes].sort(
                (notificacaoA, notificacaoB) =>
                    obterDataTempo(notificacaoB.data) - obterDataTempo(notificacaoA.data),
            ),
        [notificacoes],
    );

    const filtros = useMemo(() => {
        const projetos = [
            ...new Set(notificacoes.map((notificacao) => obterProjetoNotificacao(notificacao))),
        ].filter(Boolean);

        return [
            { id: FILTRO_TODOS, label: 'Todos' },
            ...projetos.map((projeto) => ({ id: projeto, label: projeto })),
        ];
    }, [notificacoes]);

    useEffect(() => {
        if (!filtros.some((filtro) => filtro.id === filtroAtivo)) {
            setFiltroAtivo(FILTRO_TODOS);
        }
    }, [filtroAtivo, filtros]);

    const notificacoesFiltradas = useMemo(() => {
        if (filtroAtivo === FILTRO_TODOS) {
            return notificacoesOrdenadas;
        }

        return notificacoesOrdenadas.filter(
            (notificacao) => obterProjetoNotificacao(notificacao) === filtroAtivo,
        );
    }, [filtroAtivo, notificacoesOrdenadas]);

    const gruposMobile = useMemo(() => {
        const grupos = [];
        const indicePorData = new Map();

        notificacoesFiltradas.forEach((notificacao) => {
            const dataChave = obterDataChave(notificacao.data);

            if (!indicePorData.has(dataChave)) {
                indicePorData.set(dataChave, grupos.length);
                grupos.push({
                    date: formatarData(notificacao.data),
                    notifications: [],
                });
            }

            grupos[indicePorData.get(dataChave)].notifications.push(notificacao);
        });

        return grupos;
    }, [notificacoesFiltradas]);

    async function handleOpenNotificacao(notificacao) {
        if (!notificacao?.id) {
            return;
        }

        if (notificacao.documento_id) {
            try {
                await getDocumentById(notificacao.documento_id);
            } catch (err) {
                console.error(err);
                setNotificacoes((prev) =>
                    prev.map((item) =>
                        item.id === notificacao.id ? { ...item, documentoExiste: false } : item,
                    ),
                );
                setNotificacaoSemDocumento(notificacao);
                return;
            }
        }

        try {
            if (Number(notificacao.aberto) !== 1) {
                await abrirNotificacao(notificacao.id);
                setNotificacoes((prev) =>
                    prev.map((item) =>
                        item.id === notificacao.id ? { ...item, aberto: 1 } : item,
                    ),
                );
            }
        } catch (err) {
            console.error(err);
        }

        if (notificacao.documento_id) {
            navigate(`/documento/${notificacao.documento_id}`);
        }
    }

    useEffect(() => {
        if (!notificacaoSemDocumento) {
            return undefined;
        }

        const overflowOriginal = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowOriginal;
        };
    }, [notificacaoSemDocumento]);

    const mensagem = loading
        ? 'Carregando notificações...'
        : error ||
          (notificacoesOrdenadas.length === 0
              ? 'Nenhuma notificação encontrada.'
              : notificacoesFiltradas.length === 0
                ? 'Nenhuma notificação neste filtro.'
                : '');

    return (
        <div className="min-h-screen bg-(--fundo) lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="flex flex-1 flex-col overflow-x-hidden overflow-y-scroll px-[14px] pt-7 pb-8 [scrollbar-color:var(--cinza-300)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] lg:h-screen lg:px-10 lg:py-20 xl:px-[38px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--cinza-300) [&::-webkit-scrollbar-track]:bg-transparent">
                <section className="mx-auto flex w-full max-w-[1064px] flex-col gap-4 lg:mx-0 lg:gap-8">
                    <div className="flex flex-col gap-3 lg:gap-4">
                        <Title2 className="pl-1.5 text-2xl font-bold leading-none text-(--cinza-600) lg:pl-0 lg:text-[32px]">
                            Notificações
                        </Title2>

                        <div className="-mx-[14px] overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
                            <div className="flex w-max gap-3">
                                {filtros.map((filtro) => (
                                    <button
                                        key={filtro.id}
                                        type="button"
                                        onClick={() => setFiltroAtivo(filtro.id)}
                                        aria-pressed={filtroAtivo === filtro.id}
                                        className={`h-7 shrink-0 whitespace-nowrap rounded-full px-3 text-[14px] leading-none lg:h-8 lg:text-[16px] ${
                                            filtroAtivo === filtro.id
                                                ? 'bg-(--roxo-light) text-(--roxo-dark)'
                                                : 'bg-(--cinza-200) text-(--cinza-700)'
                                        }`}
                                    >
                                        {filtro.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {mensagem ? (
                        <ParagraphMedium
                            className={`pl-1.5 lg:pl-0 ${
                                error ? 'text-(--color-alert)' : 'text-(--cinza-600)'
                            }`}
                        >
                            {mensagem}
                        </ParagraphMedium>
                    ) : (
                        <>
                            <div className="flex flex-col gap-7 lg:hidden">
                                {gruposMobile.map((group, groupIndex) => (
                                    <section
                                        key={`${group.date}-${groupIndex}`}
                                        className="flex flex-col"
                                    >
                                        <ParagraphLarge className="mb-2.5 text-(--cinza-600)">
                                            {group.date}
                                        </ParagraphLarge>

                                        <div className="flex flex-col gap-1.5">
                                            {group.notifications.map((notification) => (
                                                <Notificacao
                                                    key={notification.id}
                                                    notificacao={notification}
                                                    layout="mobile"
                                                    onOpen={handleOpenNotificacao}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>

                            <div className="hidden flex-col gap-[10px] lg:flex">
                                {notificacoesFiltradas.map((notification) => (
                                    <Notificacao
                                        key={notification.id}
                                        notificacao={{
                                            ...notification,
                                            dataFormatada: formatarData(notification.data),
                                        }}
                                        onOpen={handleOpenNotificacao}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>

            {notificacaoSemDocumento && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/25 px-4 py-6">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="documento-inexistente-titulo"
                        className="w-full max-w-[420px] rounded-2xl bg-white px-6 py-6 shadow-[var(--external-shadow)]"
                    >
                        <h2
                            id="documento-inexistente-titulo"
                            className="font-inter text-[24px] font-semibold leading-tight text-[var(--cinza-700)]"
                        >
                            Documento não encontrado
                        </h2>

                        <ParagraphMedium className="mt-4 text-[var(--cinza-600)]">
                            Este documento não existe mais ou não está mais disponível para você.
                        </ParagraphMedium>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setNotificacaoSemDocumento(null)}
                                className="rounded-lg bg-[var(--color-base)] px-5 py-2 font-semibold text-white transition-colors hover:bg-[var(--color-dark)]"
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notificacoes;
