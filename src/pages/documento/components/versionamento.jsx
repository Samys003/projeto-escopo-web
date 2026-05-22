import { useMemo, useState } from 'react';
import { GitCompare, Undo2, X } from 'lucide-react';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import Title2 from '../../../components/Typography/Title2';
import { getDocumentVersionById } from '../../../services/api';

function formatarData(data) {
    if (!data) {
        return '';
    }

    return new Date(data).toLocaleDateString('pt-BR');
}

function nomeDaVersao(index, total) {
    return `V${total - index}`;
}

function idDaVersao(versao) {
    return String(versao?.id ?? '');
}

function timestampDaVersao(versao) {
    const timestamp = new Date(versao?.criado_em || '').getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function ordenarVersoesPorData(versoesParaOrdenar) {
    return [...versoesParaOrdenar].sort((a, b) => timestampDaVersao(b) - timestampDaVersao(a));
}

function linhasDoConteudo(conteudo) {
    return String(conteudo || '').split(/\r?\n/);
}

function compararConteudos(conteudoAntigo, conteudoNovo) {
    const antigas = linhasDoConteudo(conteudoAntigo);
    const novas = linhasDoConteudo(conteudoNovo);
    const tabela = Array.from({ length: antigas.length + 1 }, () =>
        Array(novas.length + 1).fill(0)
    );

    for (let i = 1; i <= antigas.length; i += 1) {
        for (let j = 1; j <= novas.length; j += 1) {
            tabela[i][j] =
                antigas[i - 1] === novas[j - 1]
                    ? tabela[i - 1][j - 1] + 1
                    : Math.max(tabela[i - 1][j], tabela[i][j - 1]);
        }
    }

    const antigo = [];
    const novo = [];
    let i = antigas.length;
    let j = novas.length;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && antigas[i - 1] === novas[j - 1]) {
            antigo.unshift({ texto: antigas[i - 1], tipo: 'igual' });
            novo.unshift({ texto: novas[j - 1], tipo: 'igual' });
            i -= 1;
            j -= 1;
        } else if (j > 0 && (i === 0 || tabela[i][j - 1] >= tabela[i - 1][j])) {
            novo.unshift({ texto: novas[j - 1], tipo: 'novo' });
            j -= 1;
        } else {
            antigo.unshift({ texto: antigas[i - 1], tipo: 'removido' });
            i -= 1;
        }
    }

    return { antigo, novo };
}

function classeDaLinhaDiff(tipo) {
    if (tipo === 'novo') {
        return 'text-[var(--color-verde)]';
    }

    if (tipo === 'removido') {
        return 'text-[var(--color-alert)]';
    }

    return 'text-black';
}

function VersionamentoPopup({ onFechar, versoes, titulo, onErro }) {
    const [modo, setModo] = useState('historico');
    const [versoesComparadas, setVersoesComparadas] = useState([]);
    const [versoesSelecionadasIds, setVersoesSelecionadasIds] = useState(
        versoes[0] ? [idDaVersao(versoes[0])] : []
    );

    const diffComparacao = useMemo(() => {
        if (versoesComparadas.length < 2) {
            return { antigo: [], novo: [] };
        }

        return compararConteudos(versoesComparadas[1]?.conteudo, versoesComparadas[0]?.conteudo);
    }, [versoesComparadas]);

    async function buscarVersaoCompleta(versao, index) {
        const versaoDetalhada = await getDocumentVersionById(versao.id);

        return {
            ...versao,
            ...versaoDetalhada,
            id: versaoDetalhada?.id || versao.id,
            titulo: versaoDetalhada?.titulo || versao.titulo || titulo,
            conteudo: versaoDetalhada?.conteudo || versao.conteudo || '',
            criado_em: versaoDetalhada?.criado_em || versao.criado_em,
            nome: index >= 0 ? nomeDaVersao(index, versoes.length) : 'Versao',
        };
    }

    async function abrirComparacaoMobile(versao, index) {
        try {
            onErro('');
            const versaoAtual = await buscarVersaoCompleta(versao, index);
            const versaoAnterior = versoes[index + 1]
                ? await buscarVersaoCompleta(versoes[index + 1], index + 1)
                : null;

            setVersoesComparadas([versaoAtual, versaoAnterior].filter(Boolean));
            setModo('comparacao');
        } catch (error) {
            onErro(error.message || 'Erro ao carregar versao.');
        }
    }

    async function abrirComparacaoDesktop(ids) {
        const idsUnicos = [...new Set(ids)].filter(Boolean);

        if (idsUnicos.length !== 2) {
            return;
        }

        try {
            onErro('');
            const resumos = idsUnicos
                .map((id) => versoes.find((versao) => idDaVersao(versao) === id))
                .filter(Boolean);

            const detalhes = await Promise.all(
                resumos.map((resumo) => {
                    const index = versoes.findIndex(
                        (versao) => idDaVersao(versao) === idDaVersao(resumo)
                    );

                    return buscarVersaoCompleta(resumo, index);
                })
            );

            setVersoesComparadas(ordenarVersoesPorData(detalhes));
            setModo('comparacao');
        } catch (error) {
            onErro(error.message || 'Erro ao carregar versao.');
        }
    }

    async function selecionarVersaoDesktop(versao) {
        const id = idDaVersao(versao);
        const jaSelecionada = versoesSelecionadasIds.includes(id);

        if (jaSelecionada) {
            setVersoesSelecionadasIds((ids) => ids.filter((item) => item !== id));
            return;
        }

        const proximasSelecoes =
            versoesSelecionadasIds.length >= 2 ? [id] : [...versoesSelecionadasIds, id];

        setVersoesSelecionadasIds(proximasSelecoes);

        if (proximasSelecoes.length === 2) {
            await abrirComparacaoDesktop(proximasSelecoes);
        }
    }

    function voltarParaHistorico() {
        setModo('historico');
    }

    return (
        <>
            {modo === 'historico' && (
                <>
                    <div className="fixed left-6 right-6 top-[270px] z-40 rounded-2xl bg-white px-5 py-3 shadow-[var(--external-shadow)] sm:left-auto sm:right-auto sm:w-[342px] lg:hidden">
                        <div className="mb-4 flex items-center justify-between">
                            <Title2 className="w-full text-center text-[17px] font-medium text-black">
                                Histórico de Versões
                            </Title2>
                            <button type="button" onClick={onFechar}>
                                <X className="text-[var(--cinza-700)]" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {versoes.length === 0 && (
                                <ParagraphMedium className="text-[var(--cinza-500)]">
                                    Nenhuma versão encontrada.
                                </ParagraphMedium>
                            )}

                            {versoes.map((versao, index) => (
                                <div
                                    key={versao.id}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <button
                                        type="button"
                                        onClick={() => abrirComparacaoMobile(versao, index)}
                                        className={`text-left font-inter text-[14px] ${
                                            index === 0
                                                ? 'text-[var(--color-base)]'
                                                : 'text-[var(--cinza-500)]'
                                        }`}
                                    >
                                        {titulo} - {nomeDaVersao(index, versoes.length)} -{' '}
                                        {formatarData(versao.criado_em)}
                                    </button>
                                    <GitCompare className="text-[var(--color-base)]" size={20} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fixed top-[40vh] z-40 hidden w-[520px] -translate-x-1/2 rounded-xl bg-white px-8 py-4 shadow-[var(--external-shadow)] lg:left-[calc((100vw+280px)/2)] lg:block xl:left-[calc((100vw+356px)/2)]">
                        <div className="mb-4 flex items-center justify-between">
                            <Title2 className="w-full text-center text-[17px] font-medium text-black">
                                Comparar Versões
                            </Title2>
                            <button type="button" onClick={onFechar}>
                                <X className="text-[var(--cinza-700)]" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {versoes.length === 0 && (
                                <ParagraphMedium className="text-[var(--cinza-500)]">
                                    Nenhuma versão encontrada.
                                </ParagraphMedium>
                            )}

                            {versoes.map((versao, index) => {
                                const selecionada = versoesSelecionadasIds.includes(
                                    idDaVersao(versao)
                                );

                                return (
                                    <div
                                        key={versao.id}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => selecionarVersaoDesktop(versao)}
                                            className={`text-left font-inter text-[16px] ${
                                                selecionada
                                                    ? 'text-[var(--color-base)]'
                                                    : 'text-[var(--cinza-700)]'
                                            }`}
                                        >
                                            {titulo} - {nomeDaVersao(index, versoes.length)} -{' '}
                                            {formatarData(versao.criado_em)}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => selecionarVersaoDesktop(versao)}
                                            aria-label={
                                                selecionada
                                                    ? 'Remover versao da comparacao'
                                                    : 'Selecionar versao para comparar'
                                            }
                                        >
                                            {selecionada ? (
                                                <X className="text-[var(--cinza-700)]" size={22} />
                                            ) : (
                                                <GitCompare
                                                    className="text-[var(--color-base)]"
                                                    size={22}
                                                />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {modo === 'comparacao' && (
                <>
                    <div className="fixed left-4 right-4 top-[98px] z-40 max-h-[76vh] overflow-y-auto rounded-lg bg-white px-5 py-4 shadow-[var(--external-shadow)] sm:left-auto sm:right-auto sm:w-[360px] lg:hidden">
                        {versoesComparadas.map((versao, index) => (
                            <div key={versao.id} className="mb-8">
                                <Title2 className="mb-4 text-center text-[16px] font-medium text-[var(--color-base)]">
                                    {versao.titulo} - {versao.nome} -{' '}
                                    {formatarData(versao.criado_em)}
                                </Title2>
                                <div className="max-h-[230px] overflow-y-auto rounded-xl border border-[var(--cinza-400)] px-3 py-2">
                                    <pre
                                        className={`whitespace-pre-wrap font-inter text-[13px] leading-4 ${
                                            index === 0
                                                ? 'text-black'
                                                : 'text-[var(--color-verde)]'
                                        }`}
                                    >
                                        {versao.conteudo}
                                    </pre>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={voltarParaHistorico}
                                className="flex items-center gap-3 rounded-lg border border-[var(--cinza-300)] px-5 py-3 font-inter text-[16px] text-[var(--color-base)]"
                            >
                                Voltar
                                <Undo2 size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="fixed top-[25vh] z-40 hidden max-h-[76vh] -translate-x-1/2 overflow-y-auto rounded-xl bg-white px-8 py-8 shadow-[var(--external-shadow)] lg:left-[calc((100vw+280px)/2)] lg:block lg:w-[min(760px,calc(100vw-320px))] xl:left-[calc((100vw+356px)/2)] xl:w-[760px]">
                        <div className="grid gap-8 lg:grid-cols-2">
                            {versoesComparadas[0] && (
                                <div>
                                    <Title2 className="mb-5 text-center text-[16px] font-medium text-[var(--color-base)]">
                                        {versoesComparadas[0].titulo} - {versoesComparadas[0].nome}{' '}
                                        - {formatarData(versoesComparadas[0].criado_em)}
                                    </Title2>
                                    <div className="font-inter text-[16px] leading-6">
                                        {diffComparacao.novo.map((linha, index) => (
                                            <span
                                                key={`${linha.tipo}-${index}`}
                                                className={`block min-h-6 whitespace-pre-wrap ${classeDaLinhaDiff(
                                                    linha.tipo
                                                )}`}
                                            >
                                                {linha.texto || ' '}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {versoesComparadas[1] && (
                                <div>
                                    <Title2 className="mb-5 text-center text-[16px] font-medium text-[var(--color-base)]">
                                        {versoesComparadas[1].titulo} - {versoesComparadas[1].nome}{' '}
                                        - {formatarData(versoesComparadas[1].criado_em)}
                                    </Title2>
                                    <div className="font-inter text-[16px] leading-6">
                                        {diffComparacao.antigo.map((linha, index) => (
                                            <span
                                                key={`${linha.tipo}-${index}`}
                                                className={`block min-h-6 whitespace-pre-wrap ${classeDaLinhaDiff(
                                                    linha.tipo
                                                )}`}
                                            >
                                                {linha.texto || ' '}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-7 flex justify-start">
                            <button
                                type="button"
                                onClick={voltarParaHistorico}
                                className="flex items-center gap-3 rounded-lg border border-[var(--cinza-300)] px-5 py-3 font-inter text-[16px] text-[var(--color-base)]"
                            >
                                Voltar
                                <Undo2 size={22} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default VersionamentoPopup;
