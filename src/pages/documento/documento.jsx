import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title2 from '../../components/Typography/Title2';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { ChevronsLeft, ClockFading, MessagesSquare, Save, Trash2, X } from 'lucide-react';
import Comentarios from './components/comentarios';
import VersionamentoPopup from './components/versionamento';
import {
    createDocumentVersion,
    deleteDocument,
    getDocumentById,
    getDocumentVersions,
    getApiErrorMessage,
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

function numeroSeguro(valor) {
    const numero = Number(valor);

    return Number.isNaN(numero) ? null : numero;
}

function nivelAcessoDocumento(documento) {
    const nivelDireto = numeroSeguro(
        primeiroValor(
            documento,
            [
                'nivel_acesso_id',
                'nivelAcessoId',
                'usuario_nivel_acesso_id',
                'usuarioProjetoNivelAcessoId',
            ],
            null,
        ),
    );

    if (nivelDireto !== null) {
        return nivelDireto;
    }

    const projeto = primeiroValor(documento, ['projeto', 'project'], null);

    if (projeto && typeof projeto === 'object') {
        return numeroSeguro(
            primeiroValor(
                projeto,
                [
                    'nivel_acesso_id',
                    'nivelAcessoId',
                    'usuario_nivel_acesso_id',
                    'usuarioProjetoNivelAcessoId',
                ],
                null,
            ),
        );
    }

    return null;
}

function MarkdownPreview({ valor }) {
    return <MarkdownRenderer valor={valor} emptyMessage="Clique para começar a escrever." />;
}

function EditorMarkdown({ valor, onChange, onBlur }) {
    return (
        <textarea
            value={valor}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            className="min-h-[520px] w-full max-w-full resize-none overflow-x-hidden bg-transparent font-inter text-[16px] leading-7 text-black outline-none placeholder:text-[var(--cinza-500)] lg:min-h-[calc(100vh-340px)]"
        />
    );
}

function TituloDocumento({
    valor,
    onChange,
    podeEditar = true,
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
            {editando && podeEditar ? (
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
            ) : !podeEditar ? (
                <Title2 as="span" className={`block truncate ${textoClassName}`}>
                    {valor || 'Documento'}
                </Title2>
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
    const nivelAcesso = useMemo(() => nivelAcessoDocumento(documento), [documento]);
    const podeAlterarDocumento = nivelAcesso === null || [1, 2].includes(nivelAcesso);

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
                setErro(getApiErrorMessage(error, 'Erro ao carregar documento.'));
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
            setErro(getApiErrorMessage(error, 'Erro ao carregar historico.'));
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

        if (!podeAlterarDocumento) {
            setErro('Você não tem permissão para alterar este documento.');
            return;
        }

        const tituloTratado = titulo.trim();

        if (!tituloTratado) {
            setErro('Informe o título do documento.');
            return;
        }

        if (tituloTratado.length > 150) {
            setErro('O título do documento deve ter no máximo 150 caracteres.');
            return;
        }

        if (conteudo !== conteudoOriginal && !conteudo.trim()) {
            setErro('Digite algum conteúdo antes de salvar uma nova versão.');
            return;
        }

        try {
            setSalvando(true);
            setErro('');

            if (tituloTratado !== tituloOriginal) {
                await updateDocumentTitle({ documento_id: documentoId, titulo: tituloTratado });
            }

            if (conteudo !== conteudoOriginal) {
                await createDocumentVersion({ documento_id: documentoId, conteudo });
            }

            const documentoAtualizado = await getDocumentById(documentoId);
            const conteudoApi = documentoAtualizado?.conteudo || conteudo;
            const tituloApi = documentoAtualizado?.titulo || tituloTratado;

            setDocumento(documentoAtualizado);
            setTitulo(tituloApi);
            setConteudo(conteudoApi);
            setTituloOriginal(tituloApi);
            setConteudoOriginal(conteudoApi);
            setEditandoConteudo(false);
            await carregarVersoes();
        } catch (error) {
            setErro(getApiErrorMessage(error, 'Erro ao salvar documento.'));
        } finally {
            setSalvando(false);
        }
    }

    function abrirConfirmacaoExcluirDocumento() {
        if (!podeAlterarDocumento) {
            setErro('Você não tem permissão para excluir este documento.');
            return;
        }

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
            voltarTelaAnterior();
        } catch (error) {
            const mensagem =
                error.status === 500
                    ? 'Não foi possível excluir este documento agora. Tente novamente em alguns minutos.'
                    : getApiErrorMessage(error, 'Erro ao excluir documento.');

            setErroConfirmacaoExcluir(mensagem);
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

        navigate(-1);
    }

    return (
        <div className="min-h-screen min-w-0 bg-[var(--fundo)] lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="min-w-0 flex-1 px-4 pb-4 pt-3 sm:px-8 lg:px-7 lg:pb-8 lg:pt-10 xl:px-7">
                <section className="relative mx-auto max-w-[700px] min-w-0 lg:max-w-none">
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
                                podeEditar={podeAlterarDocumento}
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
                                        podeEditar={podeAlterarDocumento}
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
                                {podeAlterarDocumento && (
                                    <button
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                                        type="button"
                                        onClick={abrirConfirmacaoExcluirDocumento}
                                        disabled={excluindo}
                                        aria-label="Excluir documento"
                                    >
                                        <Trash2 className="h-6 w-6" strokeWidth={2} />
                                    </button>
                                )}

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

                    <div className="relative z-10 mt-3 min-h-[610px] min-w-0 overflow-hidden rounded-2xl border border-[var(--cinza-300)] bg-white px-4 py-4 text-black sm:px-6 lg:mt-[28px] lg:min-h-[calc(100vh-260px)] lg:px-8 lg:py-8">
                        {carregando ? (
                            <ParagraphMedium className="text-[var(--cinza-600)]">
                                Carregando documento...
                            </ParagraphMedium>
                        ) : conteudoEmEdicao && podeAlterarDocumento ? (
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
                                onClick={() => {
                                    if (podeAlterarDocumento) {
                                        setEditandoConteudo(true);
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        podeAlterarDocumento &&
                                        (event.key === 'Enter' || event.key === ' ')
                                    ) {
                                        event.preventDefault();
                                        setEditandoConteudo(true);
                                    }
                                }}
                                className={`block min-h-[520px] w-full max-w-full overflow-x-hidden overflow-y-auto pb-20 text-left outline-none lg:min-h-[calc(100vh-340px)] ${
                                    podeAlterarDocumento ? 'cursor-text' : 'cursor-default'
                                }`}
                                aria-label={
                                    podeAlterarDocumento
                                        ? 'Editar conteúdo do documento'
                                        : 'Visualizar conteúdo do documento'
                                }
                            >
                                <MarkdownPreview valor={conteudo} />
                            </div>
                        )}

                        {temAlteracao && podeAlterarDocumento && (
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
