import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title2 from '../../components/Typography/Title2';
import Title3 from '../../components/Typography/Title3';
import Title4 from '../../components/Typography/Title4';
import { ChevronsLeft, ClockFading, MessagesSquare, Save, Trash2, X } from 'lucide-react';
import Comentarios from './components/comentarios';
import VersionamentoPopup from './components/versionamento';
import {
    createDocumentVersion,
    deleteDocument,
    getDocumentById,
    getDocumentVersions,
    updateDocumentTitle,
} from '../../services/api';

function formatarData(data) {
    if (!data) {
        return '';
    }

    return new Date(data).toLocaleDateString('pt-BR');
}

function primeiroValor(objeto, campos, fallback = '') {
    for (const campo of campos) {
        if (objeto?.[campo] !== undefined && objeto?.[campo] !== null && objeto?.[campo] !== '') {
            return objeto[campo];
        }
    }

    return fallback;
}

function linkSeguro(url) {
    return /^(https?:|mailto:|\/)/i.test(url) ? url : '#';
}

function renderizarInline(texto, chaveBase) {
    const partes = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let ultimoIndice = 0;
    let indice = 0;

    for (const match of texto.matchAll(regex)) {
        if (match.index > ultimoIndice) {
            partes.push(texto.slice(ultimoIndice, match.index));
        }

        const trecho = match[0];
        const chave = `${chaveBase}-${indice}`;

        if (trecho.startsWith('**') && trecho.endsWith('**')) {
            partes.push(
                <strong key={chave} className="font-semibold">
                    {trecho.slice(2, -2)}
                </strong>,
            );
        } else if (trecho.startsWith('*') && trecho.endsWith('*')) {
            partes.push(
                <em key={chave} className="italic">
                    {trecho.slice(1, -1)}
                </em>,
            );
        } else if (trecho.startsWith('`') && trecho.endsWith('`')) {
            partes.push(
                <code
                    key={chave}
                    className="rounded bg-[var(--cinza-200)] px-1 py-0.5 font-mono text-[13px]"
                >
                    {trecho.slice(1, -1)}
                </code>,
            );
        } else {
            const [, textoLink, url] = trecho.match(/^\[([^\]]+)\]\(([^)]+)\)$/) || [];

            partes.push(
                <a
                    key={chave}
                    href={linkSeguro(url || '')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-base)] underline underline-offset-2"
                >
                    {textoLink || trecho}
                </a>,
            );
        }

        ultimoIndice = match.index + trecho.length;
        indice += 1;
    }

    if (ultimoIndice < texto.length) {
        partes.push(texto.slice(ultimoIndice));
    }

    return partes;
}

function MarkdownPreview({ valor }) {
    const elementos = [];
    const linhas = String(valor || '').split('\n');
    let listaAtual = null;
    let paragrafoAtual = [];

    function fecharParagrafo() {
        if (paragrafoAtual.length === 0) {
            return;
        }

        const texto = paragrafoAtual.join('\n');

        elementos.push(
            <ParagraphLarge
                key={`p-${elementos.length}`}
                className="mb-3 whitespace-pre-wrap break-words leading-7 text-black [overflow-wrap:anywhere]"
            >
                {renderizarInline(texto, `p-${elementos.length}`)}
            </ParagraphLarge>,
        );
        paragrafoAtual = [];
    }

    function fecharLista() {
        if (!listaAtual) {
            return;
        }

        const Component = listaAtual.tipo === 'ol' ? 'ol' : 'ul';
        const classeLista =
            listaAtual.tipo === 'ol'
                ? 'mb-4 list-decimal space-y-1 pl-6'
                : 'mb-4 list-disc space-y-1 pl-6';

        elementos.push(
            <Component key={`lista-${elementos.length}`} className={classeLista}>
                {listaAtual.itens.map((item, index) => (
                    <ParagraphMedium
                        as="li"
                        key={`${listaAtual.tipo}-${index}`}
                        className="break-words text-[16px] leading-7 text-black [overflow-wrap:anywhere]"
                    >
                        {renderizarInline(item, `${listaAtual.tipo}-${index}`)}
                    </ParagraphMedium>
                ))}
            </Component>,
        );
        listaAtual = null;
    }

    linhas.forEach((linha, index) => {
        const textoLimpo = linha.trim();

        if (!textoLimpo) {
            fecharParagrafo();
            fecharLista();
            return;
        }

        const titulo = textoLimpo.match(/^(#{1,3})\s+(.+)$/);
        const itemLista = textoLimpo.match(/^[-*]\s+(.+)$/);
        const itemOrdenado = textoLimpo.match(/^\d+\.\s+(.+)$/);
        const citacao = textoLimpo.match(/^>\s+(.+)$/);

        if (titulo) {
            fecharParagrafo();
            fecharLista();

            const nivel = titulo[1].length;
            const conteudo = renderizarInline(titulo[2], `titulo-${index}`);

            if (nivel === 1) {
                elementos.push(
                    <Title2
                        key={`titulo-${index}`}
                        className="mb-3 break-words text-[28px] leading-tight text-black [overflow-wrap:anywhere]"
                    >
                        {conteudo}
                    </Title2>,
                );
            } else if (nivel === 2) {
                elementos.push(
                    <Title3
                        key={`titulo-${index}`}
                        className="mb-3 break-words text-[22px] leading-tight text-black [overflow-wrap:anywhere]"
                    >
                        {conteudo}
                    </Title3>,
                );
            } else {
                elementos.push(
                    <Title4
                        key={`titulo-${index}`}
                        className="mb-2 break-words text-[18px] leading-tight text-black [overflow-wrap:anywhere]"
                    >
                        {conteudo}
                    </Title4>,
                );
            }
            return;
        }

        if (itemLista || itemOrdenado) {
            fecharParagrafo();

            const tipo = itemOrdenado ? 'ol' : 'ul';

            if (listaAtual?.tipo !== tipo) {
                fecharLista();
                listaAtual = { tipo, itens: [] };
            }

            listaAtual.itens.push(itemOrdenado?.[1] || itemLista?.[1]);
            return;
        }

        if (citacao) {
            fecharParagrafo();
            fecharLista();
            elementos.push(
                <ParagraphLarge
                    key={`quote-${index}`}
                    className="mb-4 border-l-4 border-[var(--color-base)] bg-[var(--cinza-100)] py-2 pl-4 text-[var(--cinza-700)]"
                >
                    {renderizarInline(citacao[1], `quote-${index}`)}
                </ParagraphLarge>,
            );
            return;
        }

        fecharLista();
        paragrafoAtual.push(textoLimpo);
    });

    fecharParagrafo();
    fecharLista();

    if (elementos.length === 0) {
        return (
            <ParagraphMedium className="text-[var(--cinza-500)]">
                Clique para começar a escrever.
            </ParagraphMedium>
        );
    }

    return <div className="max-w-none">{elementos}</div>;
}

function EditorMarkdown({ valor, onChange, onBlur }) {
    return (
        <textarea
            value={valor}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            className="min-h-[520px] w-full resize-none bg-transparent font-inter text-[16px] leading-7 text-black outline-none placeholder:text-[var(--cinza-500)] lg:min-h-[calc(100vh-340px)]"
        />
    );
}

function TituloDocumento({
    valor,
    onChange,
    className = '',
    textoClassName = '',
    campoClassName = '',
}) {
    const [editando, setEditando] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!editando) {
            return;
        }

        const campo = ref.current;
        const fim = campo?.value?.length || 0;

        campo?.focus();
        campo?.setSelectionRange(fim, fim);
    }, [editando]);

    return (
        <div className={`min-w-0 overflow-hidden ${className}`}>
            {editando ? (
                <input
                    ref={ref}
                    value={valor}
                    onChange={onChange}
                    onBlur={() => setEditando(false)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            event.currentTarget.blur();
                        }
                    }}
                    aria-label="Título do documento"
                    className={campoClassName}
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setEditando(true)}
                    title={valor || 'Documento'}
                    className="block w-full min-w-0 text-left"
                    aria-label="Editar título do documento"
                >
                    <Title2 as="span" className={`block truncate ${textoClassName}`}>
                        {valor || 'Documento'}
                    </Title2>
                </button>
            )}
        </div>
    );
}

function Documento() {
    const navigate = useNavigate();
    const { documentoId: documentoIdParam } = useParams();
    const [searchParams] = useSearchParams();
    const documentoId =
        documentoIdParam || searchParams.get('id') || searchParams.get('documentoId');

    const [documento, setDocumento] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [tituloOriginal, setTituloOriginal] = useState('');
    const [conteudoOriginal, setConteudoOriginal] = useState('');
    const [versoes, setVersoes] = useState([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [historicoAberto, setHistoricoAberto] = useState(false);
    const [comentariosAbertos, setComentariosAbertos] = useState(false);
    const [editandoConteudo, setEditandoConteudo] = useState(false);
    const [confirmacaoExcluirAberta, setConfirmacaoExcluirAberta] = useState(false);
    const [nomeConfirmacaoExcluir, setNomeConfirmacaoExcluir] = useState('');
    const [erroConfirmacaoExcluir, setErroConfirmacaoExcluir] = useState('');

    const temAlteracao = titulo !== tituloOriginal || conteudo !== conteudoOriginal;
    const conteudoEmEdicao = editandoConteudo || conteudo !== conteudoOriginal;

    const ultimaAlteracao = useMemo(() => {
        return documento?.ultima_alteracao || versoes[0]?.criado_em;
    }, [documento, versoes]);

    const nomeProjeto = primeiroValor(
        documento,
        ['nome_projeto', 'projeto_nome', 'projeto'],
        'Projeto Integrado',
    );
    const setorDocumento = primeiroValor(
        documento,
        ['setor_nome', 'nome_setor', 'setor', 'categoria'],
        'Página Web',
    );

    useEffect(() => {
        async function carregarDocumento() {
            if (!documentoId) {
                setDocumento(null);
                setTitulo('Documento');
                setConteudo('');
                setTituloOriginal('Documento');
                setConteudoOriginal('');
                setVersoes([]);
                setErro('Informe o ID do documento na URL.');
                setEditandoConteudo(false);
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);
                setErro('');

                const documentoApi = await getDocumentById(documentoId);
                const conteudoApi = documentoApi?.conteudo || '';
                const tituloApi = documentoApi?.titulo || 'Documento';

                setDocumento(documentoApi);
                setTitulo(tituloApi);
                setConteudo(conteudoApi);
                setTituloOriginal(tituloApi);
                setConteudoOriginal(conteudoApi);
                setEditandoConteudo(false);
            } catch (error) {
                setErro(error.message || 'Erro ao carregar documento.');
            } finally {
                setCarregando(false);
            }
        }

        carregarDocumento();
    }, [documentoId]);

    async function carregarVersoes() {
        if (!documentoId) {
            setErro('Informe o ID do documento na URL.');
            return [];
        }

        try {
            setErro('');
            const versoesApi = await getDocumentVersions(documentoId);
            setVersoes(versoesApi || []);
            return versoesApi || [];
        } catch (error) {
            setErro(error.message || 'Erro ao carregar historico.');
            return [];
        }
    }

    async function abrirHistorico() {
        const versoesApi = await carregarVersoes();
        setVersoes(versoesApi);
        setHistoricoAberto(true);
    }

    async function salvarDocumento() {
        if (!documentoId) {
            setErro('Informe o ID do documento na URL.');
            return;
        }

        try {
            setSalvando(true);
            setErro('');

            if (titulo !== tituloOriginal) {
                await updateDocumentTitle({ documento_id: documentoId, titulo });
            }

            if (conteudo !== conteudoOriginal) {
                await createDocumentVersion({ documento_id: documentoId, conteudo });
            }

            const documentoAtualizado = await getDocumentById(documentoId);
            const conteudoApi = documentoAtualizado?.conteudo || conteudo;
            const tituloApi = documentoAtualizado?.titulo || titulo;

            setDocumento(documentoAtualizado);
            setTitulo(tituloApi);
            setConteudo(conteudoApi);
            setTituloOriginal(tituloApi);
            setConteudoOriginal(conteudoApi);
            setEditandoConteudo(false);
            await carregarVersoes();
        } catch (error) {
            setErro(error.message || 'Erro ao salvar documento.');
        } finally {
            setSalvando(false);
        }
    }

    function abrirConfirmacaoExcluirDocumento() {
        setNomeConfirmacaoExcluir('');
        setErroConfirmacaoExcluir('');
        setConfirmacaoExcluirAberta(true);
    }

    function fecharConfirmacaoExcluirDocumento() {
        if (excluindo) {
            return;
        }

        setConfirmacaoExcluirAberta(false);
        setNomeConfirmacaoExcluir('');
        setErroConfirmacaoExcluir('');
    }

    async function excluirDocumento(event) {
        event?.preventDefault();

        if (!documentoId || excluindo) {
            return;
        }

        const nomeEsperado = (titulo || tituloOriginal || '').trim();
        const nomeDigitado = nomeConfirmacaoExcluir.trim();

        if (
            !nomeEsperado ||
            nomeDigitado.toLocaleLowerCase('pt-BR') !== nomeEsperado.toLocaleLowerCase('pt-BR')
        ) {
            setErroConfirmacaoExcluir('Digite o nome do documento para confirmar a exclusão.');
            return;
        }

        try {
            setExcluindo(true);
            setErro('');
            setErroConfirmacaoExcluir('');
            await deleteDocument(documentoId);
            navigate('/dashboard');
        } catch (error) {
            setErroConfirmacaoExcluir(error.message || 'Erro ao excluir documento.');
        } finally {
            setExcluindo(false);
        }
    }

    useEffect(() => {
        if (!confirmacaoExcluirAberta) {
            return undefined;
        }

        const overflowOriginal = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowOriginal;
        };
    }, [confirmacaoExcluirAberta]);

    function alterarTitulo(event) {
        setTitulo(event.target.value.replace(/\s*\n\s*/g, ' '));
    }

    function voltarTelaAnterior() {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen bg-[var(--fundo)] lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="flex-1 px-4 pb-4 pt-3 sm:px-8 lg:px-7 lg:pb-8 lg:pt-10 xl:px-7">
                <section className="relative mx-auto max-w-[700px] lg:max-w-none">
                    {historicoAberto && (
                        <div className="fixed inset-0 z-20 bg-black/20 lg:left-[280px] xl:left-[356px]" />
                    )}

                    <div className="relative z-30 border-b border-[var(--cinza-400)] pb-2 lg:hidden">
                        <div className="mb-2 flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={voltarTelaAnterior}
                                aria-label="Voltar"
                                className="shrink-0"
                            >
                                <ChevronsLeft className="h-8 w-8 text-gray-900" strokeWidth={3} />
                            </button>

                            <TituloDocumento
                                valor={titulo}
                                onChange={alterarTitulo}
                                className="h-10 flex-1"
                                textoClassName="text-[22px] font-semibold leading-10 text-black sm:text-[26px]"
                                campoClassName="h-10 w-full rounded-sm border border-[var(--cinza-600)] bg-transparent px-1 font-inter text-[22px] font-semibold leading-10 text-black outline-none sm:text-[26px]"
                            />
                        </div>

                        <div className="flex min-w-0 items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                {temAlteracao ? (
                                    <ParagraphMedium className="break-words text-[var(--color-alert)] [overflow-wrap:anywhere]">
                                        Alterações não salvas!
                                    </ParagraphMedium>
                                ) : (
                                    <ParagraphMedium className="break-words text-[var(--color-variant)] [overflow-wrap:anywhere]">
                                        Última Alteração: {formatarData(ultimaAlteracao)}
                                    </ParagraphMedium>
                                )}
                            </div>

                            <div className="flex shrink-0 items-center gap-7">
                                <button
                                    type="button"
                                    onClick={abrirHistorico}
                                    aria-label="Historico"
                                >
                                    <ClockFading
                                        className="h-10 w-10 cursor-pointer text-[var(--color-variant)]"
                                        strokeWidth={2}
                                    />
                                </button>
                                <button
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)]"
                                    type="button"
                                    onClick={() => setComentariosAbertos(true)}
                                    aria-label="Comentarios"
                                >
                                    <MessagesSquare className="h-6 w-6" strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-30 hidden border-b border-[var(--cinza-400)] pb-3 lg:block lg:min-h-[84px]">
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(190px,260px)_112px] lg:items-start">
                            <div className="min-w-0">
                                <div className="mb-2 flex min-w-0 items-center gap-3 lg:mb-1">
                                    <button
                                        type="button"
                                        onClick={voltarTelaAnterior}
                                        aria-label="Voltar"
                                        className="shrink-0"
                                    >
                                        <ChevronsLeft
                                            className="h-8 w-8 text-gray-900"
                                            strokeWidth={3}
                                        />
                                    </button>

                                    <TituloDocumento
                                        valor={titulo}
                                        onChange={alterarTitulo}
                                        className="h-12 w-full max-w-[560px]"
                                        textoClassName="text-[30px] font-semibold leading-[48px] text-[var(--cinza-700)] xl:text-[34px]"
                                        campoClassName="h-12 w-full rounded-sm border border-[var(--cinza-600)] bg-transparent px-1 font-inter text-[30px] font-semibold leading-[48px] text-[var(--cinza-700)] outline-none xl:text-[34px]"
                                    />
                                </div>

                                {temAlteracao ? (
                                    <div className="inline-flex min-h-5 max-w-[250px] items-center rounded-full bg-[#ffd6d6] px-6 text-center">
                                        <ParagraphMedium className="truncate text-[var(--color-alert)]">
                                            Alterações não salvas!
                                        </ParagraphMedium>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={abrirHistorico}
                                        className="flex min-h-8 w-full max-w-[420px] items-center justify-center gap-3 rounded-full border border-[var(--color-base)] px-4 py-1 text-center text-[var(--color-base)] transition-colors hover:bg-[var(--roxo-light)] lg:ml-8 xl:ml-12"
                                    >
                                        <ParagraphLarge
                                            as="span"
                                            className="min-w-0 break-words text-[var(--color-base)] [overflow-wrap:anywhere]"
                                        >
                                            Última alteração: {formatarData(ultimaAlteracao)}
                                        </ParagraphLarge>
                                        <ClockFading
                                            className="h-6 w-6 shrink-0 text-[var(--color-base)]"
                                            strokeWidth={2}
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="min-w-0 break-words text-gray-900 [overflow-wrap:anywhere] lg:pt-2">
                                <ParagraphLarge className="leading-6">{nomeProjeto}</ParagraphLarge>
                                <ParagraphLarge className="leading-6">
                                    Setor: {setorDocumento}
                                </ParagraphLarge>
                            </div>

                            <div className="flex shrink-0 items-center gap-6 lg:justify-end lg:pt-1">
                                <button
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                                    type="button"
                                    onClick={abrirConfirmacaoExcluirDocumento}
                                    disabled={excluindo}
                                    aria-label="Excluir documento"
                                >
                                    <Trash2 className="h-6 w-6" strokeWidth={2} />
                                </button>

                                <button
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)]"
                                    type="button"
                                    onClick={() => setComentariosAbertos(true)}
                                    aria-label="Comentarios"
                                >
                                    <MessagesSquare className="h-6 w-6" strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {erro && (
                        <ParagraphMedium className="mt-2 text-[var(--color-alert)]">
                            {erro}
                        </ParagraphMedium>
                    )}

                    <div className="relative z-10 mt-3 min-h-[610px] rounded-2xl border border-[var(--cinza-300)] bg-white px-4 py-4 text-black sm:px-6 lg:mt-[28px] lg:min-h-[calc(100vh-260px)] lg:px-8 lg:py-8">
                        {carregando ? (
                            <ParagraphMedium className="text-[var(--cinza-600)]">
                                Carregando documento...
                            </ParagraphMedium>
                        ) : conteudoEmEdicao ? (
                            <EditorMarkdown
                                valor={conteudo}
                                onChange={setConteudo}
                                onBlur={() => {
                                    if (conteudo === conteudoOriginal) {
                                        setEditandoConteudo(false);
                                    }
                                }}
                            />
                        ) : (
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setEditandoConteudo(true)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setEditandoConteudo(true);
                                    }
                                }}
                                className="block min-h-[520px] w-full overflow-y-auto pb-20 text-left outline-none lg:min-h-[calc(100vh-340px)]"
                                aria-label="Editar conteúdo do documento"
                            >
                                <MarkdownPreview valor={conteudo} />
                            </div>
                        )}

                        {temAlteracao && (
                            <button
                                type="button"
                                onClick={salvarDocumento}
                                disabled={salvando}
                                className="absolute bottom-4 right-4 flex items-center gap-3 rounded-lg bg-[var(--color-base)] px-5 py-3 text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                            >
                                <Save size={22} />
                                <ParagraphLarge as="span" className="text-white">
                                    {salvando ? 'Salvando...' : 'Salvar'}
                                </ParagraphLarge>
                            </button>
                        )}
                    </div>

                    {historicoAberto && (
                        <VersionamentoPopup
                            onFechar={() => setHistoricoAberto(false)}
                            versoes={versoes}
                            titulo={titulo}
                            onErro={setErro}
                        />
                    )}
                </section>
            </main>

            {comentariosAbertos && (
                <Comentarios
                    documentoId={documentoId}
                    onFechar={() => setComentariosAbertos(false)}
                    onErro={setErro}
                />
            )}

            {confirmacaoExcluirAberta && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/25 px-4 py-6">
                    <form
                        onSubmit={excluirDocumento}
                        className="relative w-full max-w-[calc(100vw-24px)] rounded-[34px] bg-white px-8 py-11 shadow-[var(--external-shadow)] sm:px-10 lg:max-w-[900px] lg:rounded-[28px] lg:px-16 lg:py-10"
                    >
                        <button
                            type="button"
                            onClick={fecharConfirmacaoExcluirDocumento}
                            disabled={excluindo}
                            className="absolute right-5 top-5 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)] disabled:opacity-50 lg:right-9 lg:top-9"
                            aria-label="Fechar confirmação"
                        >
                            <X className="h-5 w-5 lg:h-7 lg:w-7" strokeWidth={3.4} />
                        </button>

                        <Title2 className="pr-7 text-left text-[30px] leading-tight text-black lg:pr-8 lg:text-center lg:text-[28px]">
                            Tem certeza que deseja deletar este documento?
                        </Title2>

                        <div className="mx-auto mt-9 w-full lg:mt-14 lg:max-w-[520px]">
                            <ParagraphMedium className="mb-2 text-center text-xl font-semibold text-[var(--color-dark)] lg:text-xl">
                                Para prosseguir digite o nome do documento
                            </ParagraphMedium>
                            <ParagraphMedium className="mb-4 break-words text-center font-semibold text-[var(--cinza-700)] [overflow-wrap:anywhere]">
                                {titulo || tituloOriginal || 'Documento'}
                            </ParagraphMedium>

                            <input
                                type="text"
                                value={nomeConfirmacaoExcluir}
                                onChange={(event) => {
                                    setNomeConfirmacaoExcluir(event.target.value);
                                    setErroConfirmacaoExcluir('');
                                }}
                                disabled={excluindo}
                                className="h-12 w-full rounded-xl border-2 border-[var(--cinza-500)] bg-white px-4 text-lg text-[var(--cinza-700)] opacity-100 outline-none focus:border-[var(--color-base)] lg:h-11 lg:border-black lg:text-base"
                                placeholder="Digite o nome do documento"
                            />

                            {erroConfirmacaoExcluir && (
                                <ParagraphMedium className="mt-3 text-center text-[var(--color-base)]">
                                    {erroConfirmacaoExcluir}
                                </ParagraphMedium>
                            )}
                        </div>

                        <div className="mx-auto mt-16 flex w-full justify-end lg:mt-9 lg:max-w-[620px]">
                            <button
                                type="submit"
                                disabled={excluindo}
                                className="rounded-lg bg-[var(--color-base)] px-10 py-3 text-lg font-medium text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50 lg:px-8 lg:py-2 lg:text-base"
                            >
                                {excluindo ? 'Excluindo...' : 'Prosseguir'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Documento;
