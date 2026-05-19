import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title2 from '../../components/Typography/Title2';
import {
    ChevronsLeft,
    GitCompare,
    History,
    MessagesSquare,
    Save,
    Undo2,
    X,
} from 'lucide-react';
import {
    createDocumentVersion,
    getDocumentById,
    getDocumentVersionById,
    getDocumentVersions,
    updateDocumentTitle,
} from '../../services/api';

function formatarData(data) {
    if (!data) {
        return '';
    }

    return new Date(data).toLocaleDateString('pt-BR');
}

function nomeDaVersao(index, total) {
    return `V${total - index}`;
}

function Documento() {
    const { documentoId: documentoIdParam } = useParams();
    const [searchParams] = useSearchParams();
    const documentoId = documentoIdParam || searchParams.get('id') || searchParams.get('documentoId') || 1;

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
    const [comparacaoAberta, setComparacaoAberta] = useState(false);
    const [versoesComparadas, setVersoesComparadas] = useState([]);

    const temAlteracao = titulo !== tituloOriginal || conteudo !== conteudoOriginal;

    const ultimaAlteracao = useMemo(() => {
        return documento?.ultima_alteracao || versoes[0]?.criado_em;
    }, [documento, versoes]);

    useEffect(() => {
        async function carregarDocumento() {
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
        setComparacaoAberta(false);
        setHistoricoAberto(true);
    }

    async function abrirComparacao(versao, index) {
        try {
            setErro('');
            const versaoAtual = await getDocumentVersionById(versao.id);
            const versaoAnterior = versoes[index + 1]
                ? await getDocumentVersionById(versoes[index + 1].id)
                : null;
            const versoesSelecionadas = [
                {
                    ...versaoAtual,
                    nome: nomeDaVersao(index, versoes.length),
                },
                versaoAnterior && {
                    ...versaoAnterior,
                    nome: nomeDaVersao(index + 1, versoes.length),
                },
            ].filter(Boolean);

            setVersoesComparadas(versoesSelecionadas);
            setHistoricoAberto(false);
            setComparacaoAberta(true);
        } catch (error) {
            setErro(error.message || 'Erro ao carregar versao.');
        }
    }

    async function salvarDocumento() {
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

            <main className="flex-1 px-4 pb-4 pt-3 sm:px-8 lg:px-8 lg:py-14 xl:px-20">
                <section className="relative mx-auto max-w-[700px] lg:max-w-[900px]">
                    {(historicoAberto || comparacaoAberta) && (
                        <div className="fixed inset-0 z-20 bg-black/20 lg:left-[280px] xl:left-[356px]" />
                    )}

                    <div className="relative z-30 border-b border-[var(--cinza-400)] pb-2">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <Link to="/dashboard" aria-label="Voltar">
                                    <ChevronsLeft className="h-8 w-8 text-gray-900" strokeWidth={3} />
                                </Link>

                                <input
                                    value={titulo}
                                    onChange={(event) => setTitulo(event.target.value)}
                                    className="w-full max-w-[310px] rounded-sm border border-transparent bg-transparent px-1 font-inter text-[26px] font-semibold leading-none text-black outline-none focus:border-[var(--cinza-600)]"
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
                                Data de criação: {formatarData(documento?.criado_em) || '17/03/2026'}
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

                    <div className="relative z-10 mt-3 min-h-[610px] rounded-2xl border border-[var(--cinza-300)] bg-white px-4 py-4 text-black sm:px-6">
                        {carregando ? (
                            <ParagraphMedium className="text-[var(--cinza-600)]">
                                Carregando documento...
                            </ParagraphMedium>
                        ) : (
                            <textarea
                                value={conteudo}
                                onChange={(event) => setConteudo(event.target.value)}
                                className="min-h-[520px] w-full resize-none bg-transparent font-inter text-[16px] leading-6 text-black outline-none"
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
                        <div className="fixed left-6 right-6 top-[270px] z-40 rounded-2xl bg-white px-5 py-3 shadow-[var(--external-shadow)] sm:left-auto sm:right-auto sm:w-[342px] lg:left-1/2 lg:-translate-x-1/2">
                            <div className="mb-4 flex items-center justify-between">
                                <Title2 className="w-full text-center text-[17px] font-medium text-black">
                                    Histórico de Versões
                                </Title2>
                                <button type="button" onClick={() => setHistoricoAberto(false)}>
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
                                            onClick={() => abrirComparacao(versao, index)}
                                            className={`text-left font-inter text-[14px] ${
                                                index === 0
                                                    ? 'text-[var(--color-base)]'
                                                    : 'text-[var(--cinza-500)]'
                                            }`}
                                        >
                                            {titulo} - {nomeDaVersao(index, versoes.length)} -{' '}
                                            {formatarData(versao.criado_em)}
                                        </button>
                                        <GitCompare
                                            className="text-[var(--color-base)]"
                                            size={20}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {comparacaoAberta && (
                        <div className="fixed left-4 right-4 top-[98px] z-40 max-h-[76vh] overflow-y-auto rounded-lg bg-white px-5 py-4 shadow-[var(--external-shadow)] sm:left-auto sm:right-auto sm:w-[360px] lg:left-1/2 lg:-translate-x-1/2">
                            {versoesComparadas.map((versao, index) => (
                                <div key={versao.id} className="mb-8">
                                    <Title2 className="mb-4 text-center text-[16px] font-medium text-[var(--color-base)]">
                                        {versao.titulo} - {versao.nome} - {formatarData(versao.criado_em)}
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
                                    onClick={() => {
                                        setComparacaoAberta(false);
                                        setHistoricoAberto(true);
                                    }}
                                    className="flex items-center gap-3 rounded-lg border border-[var(--cinza-300)] px-5 py-3 font-inter text-[16px] text-[var(--color-base)]"
                                >
                                    Voltar
                                    <Undo2 size={22} />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Documento;
