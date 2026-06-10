import { useMemo, useState } from 'react';
import { GitCompare, Undo2, X } from 'lucide-react';
import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import Title2 from '../../../components/Typography/Title2';
import { getDocumentVersionById } from '../../../services/api';

function formatarData(data) {
    if (!data) {
        return '';
    }

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
        return '';
    }

    return dataFormatada.toLocaleDateString('pt-BR');
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
    const texto = String(conteudo || '');

    if (!texto) {
        return [];
    }

    return texto.split(/\r?\n/);
}

function adicionarLinha(partes, texto, tipo) {
    partes.push({ texto, tipo });
}

function compararConteudos(conteudoAntigo, conteudoNovo) {
    const antigas = linhasDoConteudo(conteudoAntigo);
    const novas = linhasDoConteudo(conteudoNovo);
    const matriz = Array.from({ length: antigas.length + 1 }, () =>
        Array(novas.length + 1).fill(0),
    );
    const antigo = [];
    const novo = [];

    for (let linhaAntiga = antigas.length - 1; linhaAntiga >= 0; linhaAntiga -= 1) {
        for (let linhaNova = novas.length - 1; linhaNova >= 0; linhaNova -= 1) {
            if (antigas[linhaAntiga] === novas[linhaNova]) {
                matriz[linhaAntiga][linhaNova] = matriz[linhaAntiga + 1][linhaNova + 1] + 1;
            } else {
                matriz[linhaAntiga][linhaNova] = Math.max(
                    matriz[linhaAntiga + 1][linhaNova],
                    matriz[linhaAntiga][linhaNova + 1],
                );
            }
        }
    }

    let linhaAntiga = 0;
    let linhaNova = 0;

    while (linhaAntiga < antigas.length || linhaNova < novas.length) {
        if (
            linhaAntiga < antigas.length &&
            linhaNova < novas.length &&
            antigas[linhaAntiga] === novas[linhaNova]
        ) {
            adicionarLinha(antigo, antigas[linhaAntiga], 'igual');
            adicionarLinha(novo, novas[linhaNova], 'igual');
            linhaAntiga += 1;
            linhaNova += 1;
        } else if (
            linhaNova >= novas.length ||
            (linhaAntiga < antigas.length &&
                matriz[linhaAntiga + 1][linhaNova] >= matriz[linhaAntiga][linhaNova + 1])
        ) {
            adicionarLinha(antigo, antigas[linhaAntiga], 'removido');
            linhaAntiga += 1;
        } else {
            adicionarLinha(novo, novas[linhaNova], 'novo');
            linhaNova += 1;
        }
    }

    return { antigo, novo };
}

function classeDaLinhaDiff(tipo) {
    if (tipo === 'novo') {
        return 'bg-[#e8f7ee] text-[var(--color-verde)]';
    }

    if (tipo === 'removido') {
        return 'bg-[#ffe8e8] text-[var(--color-alert)]';
    }

    return 'text-black';
}

function TextoDiff({ partes }) {
    return (
        <div className="min-h-5 space-y-1">
            {partes.map((parte, index) => (
                <ParagraphLarge
                    as="div"
                    className={`min-h-5 whitespace-pre-wrap rounded px-2 py-0.5 text-[13px] leading-4 break-words [overflow-wrap:anywhere] lg:text-[16px] lg:leading-6 ${classeDaLinhaDiff(parte.tipo)}`}
                    key={`${parte.tipo}-${index}`}
                >
                    {parte.texto || ' '}
                </ParagraphLarge>
            ))}
        </div>
    );
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

    async function abrirComparacao(ids) {
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

    async function selecionarVersao(versao) {
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
            await abrirComparacao(proximasSelecoes);
        }
    }

    function voltarParaHistorico() {
        setModo('historico');
    }

    return (
        <>
            {modo === 'historico' && (
                <div className="fixed left-4 right-4 top-1/2 z-40 max-h-[calc(100vh-96px)] -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--color-base)] bg-white px-5 py-4 shadow-[var(--external-shadow)] sm:left-1/2 sm:right-auto sm:w-[342px] sm:-translate-x-1/2 lg:left-[calc((100vw+280px)/2)] lg:w-[520px] xl:left-[calc((100vw+356px)/2)]">
                    <div className="mb-4 flex items-center justify-between">
                        <Title2 className="w-full text-center text-[17px] font-medium text-black">
                            Comparar Versões
                        </Title2>
                        <button type="button" onClick={onFechar} aria-label="Fechar versionamento">
                            <X className="text-[var(--cinza-700)]" />
                        </button>
                    </div>

                    <div className="flex max-h-[calc(100vh-180px)] flex-col gap-3 overflow-y-auto pr-1 lg:gap-4">
                        {versoes.length === 0 && (
                            <ParagraphMedium className="text-[var(--cinza-500)]">
                                Nenhuma versão encontrada.
                            </ParagraphMedium>
                        )}

                        {versoes.map((versao, index) => {
                            const selecionada = versoesSelecionadasIds.includes(idDaVersao(versao));

                            return (
                                <div
                                    key={versao.id}
                                    className="flex min-w-0 items-start justify-between gap-3"
                                >
                                    <button
                                        type="button"
                                        onClick={() => selecionarVersao(versao)}
                                        className="min-w-0 flex-1 text-left"
                                    >
                                        <ParagraphLarge
                                            as="span"
                                            className={`block min-w-0 break-words text-[14px] [overflow-wrap:anywhere] lg:text-[16px] ${
                                            selecionada
                                                ? 'text-[var(--color-base)]'
                                                : 'text-[var(--cinza-600)]'
                                        }`}
                                        >
                                            {titulo} - {nomeDaVersao(index, versoes.length)} -{' '}
                                            {formatarData(versao.criado_em)}
                                        </ParagraphLarge>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selecionarVersao(versao)}
                                        aria-label={
                                            selecionada
                                                ? 'Remover versão da comparação'
                                                : 'Selecionar versão para comparar'
                                        }
                                        className="shrink-0"
                                    >
                                        {selecionada ? (
                                            <X className="text-[var(--cinza-700)]" size={20} />
                                        ) : (
                                            <GitCompare
                                                className="text-[var(--color-base)]"
                                                size={20}
                                            />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {modo === 'comparacao' && (
                <div className="fixed left-4 right-4 top-1/2 z-40 max-h-[calc(100vh-64px)] -translate-y-1/2 overflow-y-auto rounded-lg border border-[var(--color-base)] bg-white px-5 py-4 shadow-[var(--external-shadow)] sm:left-1/2 sm:right-auto sm:w-[360px] sm:-translate-x-1/2 lg:left-[calc((100vw+280px)/2)] lg:w-[min(760px,calc(100vw-320px))] lg:px-8 lg:py-7 xl:left-[calc((100vw+356px)/2)] xl:w-[760px]">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {versoesComparadas[0] && (
                            <div className="min-w-0">
                                <Title2 className="mb-4 break-words text-center text-[16px] font-medium leading-snug text-[var(--color-base)] [overflow-wrap:anywhere]">
                                    {versoesComparadas[0].titulo} - {versoesComparadas[0].nome} -{' '}
                                    {formatarData(versoesComparadas[0].criado_em)}
                                </Title2>
                                <div className="max-h-[230px] overflow-y-auto rounded-xl border border-[var(--cinza-400)] px-3 py-2 lg:max-h-[46vh]">
                                    <div>
                                        <TextoDiff partes={diffComparacao.novo} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {versoesComparadas[1] && (
                            <div className="min-w-0">
                                <Title2 className="mb-4 break-words text-center text-[16px] font-medium leading-snug text-[var(--color-base)] [overflow-wrap:anywhere]">
                                    {versoesComparadas[1].titulo} - {versoesComparadas[1].nome} -{' '}
                                    {formatarData(versoesComparadas[1].criado_em)}
                                </Title2>
                                <div className="max-h-[230px] overflow-y-auto rounded-xl border border-[var(--cinza-400)] px-3 py-2 lg:max-h-[46vh]">
                                    <div>
                                        <TextoDiff partes={diffComparacao.antigo} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-center lg:justify-start">
                        <button
                            type="button"
                            onClick={voltarParaHistorico}
                            className="flex items-center gap-3 rounded-lg border border-[var(--cinza-300)] px-5 py-3 text-[var(--color-base)]"
                        >
                            <ParagraphLarge as="span" className="text-[var(--color-base)]">
                                Voltar
                            </ParagraphLarge>
                            <Undo2 size={22} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default VersionamentoPopup;
