import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import { ChevronsLeft, History, MessagesSquare, Save } from 'lucide-react';
import VersionamentoPopup from './components/versionamento';
import {
    createDocumentVersion,
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

function Documento() {
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
    const [historicoAberto, setHistoricoAberto] = useState(false);

    const temAlteracao = titulo !== tituloOriginal || conteudo !== conteudoOriginal;

    const ultimaAlteracao = useMemo(() => {
        return documento?.ultima_alteracao || versoes[0]?.criado_em;
    }, [documento, versoes]);

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

    return (
        <div className="min-h-screen bg-[var(--fundo)] lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="flex-1 px-4 pb-4 pt-3 sm:px-8 lg:px-8 lg:pb-8 lg:pt-10 xl:px-10">
                <section className="relative mx-auto max-w-[700px] lg:max-w-none">
                    {historicoAberto && (
                        <div className="fixed inset-0 z-20 bg-black/20 lg:left-[280px] xl:left-[356px]" />
                    )}

                    <div className="relative z-30 border-b border-[var(--cinza-400)] pb-2">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <Link to="/listadedocumento" aria-label="Voltar">
                                    <ChevronsLeft
                                        className="h-8 w-8 text-gray-900"
                                        strokeWidth={3}
                                    />
                                </Link>

                                <input
                                    value={titulo}
                                    onChange={(event) => setTitulo(event.target.value)}
                                    className="w-full rounded-sm border border-transparent bg-transparent px-1 font-inter text-[26px] font-semibold leading-none text-black outline-none focus:border-[var(--cinza-600)] lg:max-w-[560px]"
                                />
                            </div>

                            {temAlteracao ? (
                                <ParagraphMedium className="text-[var(--color-alert)]">
                                    Alterações não salvas!
                                </ParagraphMedium>
                            ) : (
                                <ParagraphMedium className="text-[var(--color-variant)]">
                                    Última Alteração: {formatarData(ultimaAlteracao)}
                                </ParagraphMedium>
                            )}

                            <ParagraphMedium className="text-black">
                                Data de criação:{' '}
                                {formatarData(documento?.criado_em) || '17/03/2026'}
                            </ParagraphMedium>
                        </div>

                        <div className="absolute bottom-2 right-3 flex items-center gap-7">
                            <button type="button" onClick={abrirHistorico} aria-label="Historico">
                                <History
                                    className="h-10 w-10 cursor-pointer text-[var(--color-variant)]"
                                    strokeDasharray="8 8"
                                    strokeWidth={2}
                                />
                            </button>
                            <button
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)]"
                                type="button"
                                aria-label="Comentarios"
                            >
                                <MessagesSquare className="h-6 w-6" strokeWidth={2} />
                            </button>
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
        </div>
    );
}

export default Documento;
