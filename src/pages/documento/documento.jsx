import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import { ChevronsLeft, ClockFading, MessagesSquare, Save, Trash2 } from 'lucide-react';
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

function ajustarAlturaTextarea(elemento) {
    if (!elemento) {
        return;
    }

    elemento.style.height = 'auto';
    elemento.style.height = `${elemento.scrollHeight}px`;
}

function TituloDocumento({ valor, onChange, className }) {
    const ref = useRef(null);

    useEffect(() => {
        ajustarAlturaTextarea(ref.current);
    }, [valor]);

    return (
        <textarea
            ref={ref}
            value={valor}
            onChange={(event) => {
                onChange(event);
                ajustarAlturaTextarea(event.currentTarget);
            }}
            rows={1}
            aria-label="Título do documento"
            className={className}
        />
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

    const temAlteracao = titulo !== tituloOriginal || conteudo !== conteudoOriginal;

    const ultimaAlteracao = useMemo(() => {
        return documento?.ultima_alteracao || versoes[0]?.criado_em;
    }, [documento, versoes]);

    const nomeProjeto = primeiroValor(
        documento,
        ['nome_projeto', 'projeto_nome', 'projeto'],
        'Projeto Integrado'
    );
    const setorDocumento = primeiroValor(
        documento,
        ['setor_nome', 'nome_setor', 'setor', 'categoria'],
        'Página Web'
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
            await carregarVersoes();
        } catch (error) {
            setErro(error.message || 'Erro ao salvar documento.');
        } finally {
            setSalvando(false);
        }
    }

    async function excluirDocumento() {
        if (!documentoId || excluindo) {
            return;
        }

        const confirmar = window.confirm('Tem certeza que deseja excluir este documento?');

        if (!confirmar) {
            return;
        }

        try {
            setExcluindo(true);
            setErro('');
            await deleteDocument(documentoId);
            navigate('/dashboard');
        } catch (error) {
            setErro(error.message || 'Erro ao excluir documento.');
        } finally {
            setExcluindo(false);
        }
    }

    function alterarTitulo(event) {
        setTitulo(event.target.value.replace(/\s*\n\s*/g, ' '));
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
                        <div className="mb-2 flex min-w-0 items-start gap-3">
                            <Link
                                to="/listadedocumento"
                                aria-label="Voltar"
                                className="shrink-0"
                            >
                                <ChevronsLeft
                                    className="h-8 w-8 text-gray-900"
                                    strokeWidth={3}
                                />
                            </Link>

                            <TituloDocumento
                                valor={titulo}
                                onChange={alterarTitulo}
                                className="min-w-0 flex-1 resize-none overflow-hidden rounded-sm border border-transparent bg-transparent px-1 font-inter text-[26px] font-semibold leading-tight text-black outline-none [field-sizing:content] focus:border-[var(--cinza-600)]"
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
                        <div className="grid gap-4 lg:grid-cols-[minmax(360px,1fr)_260px_112px] lg:items-start">
                            <div className="min-w-0">
                                <div className="mb-2 flex min-w-0 items-start gap-3 lg:mb-1 lg:pl-16">
                                    <TituloDocumento
                                        valor={titulo}
                                        onChange={alterarTitulo}
                                        className="w-full max-w-[560px] resize-none overflow-hidden rounded-sm border border-transparent bg-transparent px-1 font-inter text-[26px] font-semibold leading-tight text-[var(--cinza-700)] outline-none [field-sizing:content] focus:border-[var(--cinza-600)] lg:text-[34px]"
                                    />
                                </div>

                                {temAlteracao ? (
                                    <ParagraphMedium className="break-words text-[var(--color-alert)] [overflow-wrap:anywhere] lg:ml-16">
                                        Alterações não salvas!
                                    </ParagraphMedium>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={abrirHistorico}
                                        className="flex min-h-8 w-full max-w-[420px] items-center justify-center gap-3 rounded-full border border-[var(--color-base)] px-4 py-1 text-center font-inter text-[16px] text-[var(--color-base)] transition-colors hover:bg-[var(--roxo-light)] lg:ml-8"
                                    >
                                        <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                            Última alteração: {formatarData(ultimaAlteracao)}
                                        </span>
                                        <ClockFading
                                            className="h-6 w-6 shrink-0 text-[var(--color-base)]"
                                            strokeWidth={2}
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="min-w-0 break-words font-inter text-[16px] leading-6 text-gray-900 [overflow-wrap:anywhere] lg:pt-2">
                                <p>{nomeProjeto}</p>
                                <p>Setor: {setorDocumento}</p>
                            </div>

                            <div className="flex shrink-0 items-center gap-6 lg:justify-end lg:pt-1">
                                <button
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                                    type="button"
                                    onClick={excluirDocumento}
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

                    <div className="relative z-10 mt-3 min-h-[610px] rounded-2xl border border-[var(--cinza-300)] bg-white px-4 py-4 text-black sm:px-6 lg:mt-[68px] lg:min-h-[calc(100vh-260px)] lg:px-8 lg:py-8">
                        {carregando ? (
                            <ParagraphMedium className="text-[var(--cinza-600)]">
                                Carregando documento...
                            </ParagraphMedium>
                        ) : (
                            <textarea
                                value={conteudo}
                                onChange={(event) => setConteudo(event.target.value)}
                                className="min-h-[520px] w-full resize-none bg-transparent font-inter text-[16px] leading-6 text-black outline-none lg:min-h-[calc(100vh-340px)]"
                            />
                        )}

                        {temAlteracao && (
                            <button
                                type="button"
                                onClick={salvarDocumento}
                                disabled={salvando}
                                className="absolute bottom-4 right-4 flex items-center gap-3 rounded-lg bg-[var(--color-base)] px-5 py-3 font-inter text-[16px] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                            >
                                <Save size={22} />
                                {salvando ? 'Salvando...' : 'Salvar'}
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
        </div>
    );
}

export default Documento;
