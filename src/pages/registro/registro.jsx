import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronsLeft, Lightbulb, Save, Trash2, X } from 'lucide-react';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title2 from '../../components/Typography/Title2';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import {
    createRegister,
    createDocumentComment,
    deleteRegister,
    getRegisterById,
    getApiErrorMessage,
    updateRegisterContent,
    updateRegisterTitle,
} from '../../services/api';
import { getDashboard } from '../dashboard/services/dashboard-endpoints';
import Sugestao from './components/sugestao';
import { limparMarkdownTexto } from '../../utils/markdown-text';

const registroPadrao = {
    titulo: 'Registro 01',
    conteudo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec est ac odio ultrices hendrerit. Sed nunc massa, volutpat nec porttitor non, ullamcorper sed lectus. Nulla nec ex nec ipsum commodo lacinia eget quis justo. Nam semper, justo convallis porttitor rutrum, mi risus condimentum purus, et pulvinar velit elit a ante. Donec venenatis massa eget euismod pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur ac maximus libero, rutrum mattis turpis.',
    nome_projeto: 'Projeto Integrado',
    setor: 'Página Web',
    responsavel: 'Equipe Escopo',
    data_criacao: '2026-03-17T10:00:00Z',
    ultima_alteracao: '2026-05-16T10:00:00Z',
};

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

function primeiroValor(objeto, campos, fallback = '') {
    for (const campo of campos) {
        if (objeto?.[campo] !== undefined && objeto?.[campo] !== null && objeto?.[campo] !== '') {
            return objeto[campo];
        }
    }

    return fallback;
}

function normalizarIdUrl(valor) {
    return String(valor || '').replace(/^:/, '');
}

function normalizarDocumentoDestino(documento) {
    const id = normalizarIdUrl(primeiroValor(documento, ['id', 'documento_id', 'documentoId'], ''));

    if (!id) {
        return null;
    }

    return {
        id,
        titulo: primeiroValor(
            documento,
            ['titulo', 'documento', 'nome', 'nome_documento'],
            'Documento',
        ),
        setor: primeiroValor(
            documento,
            ['setor', 'setor_nome', 'nome_setor', 'categoria', 'categoria_nome'],
            'Web',
        ),
    };
}

function textoSelecionadoDentro(elemento) {
    const selecao = window.getSelection?.();

    if (!selecao || selecao.isCollapsed) {
        return '';
    }

    const origemDentro = elemento.contains(selecao.anchorNode);
    const fimDentro = elemento.contains(selecao.focusNode);

    if (!origemDentro || !fimDentro) {
        return '';
    }

    return selecao.toString().trim().replace(/\s+/g, ' ');
}

function MarkdownPreview({ valor }) {
    return <MarkdownRenderer valor={valor} emptyMessage="Clique para começar o registro." />;
}

function EditorMarkdown({ valor, onChange, onBlur, onContextMenu }) {
    return (
        <textarea
            value={valor}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            onContextMenu={onContextMenu}
            className="min-h-[520px] w-full resize-none bg-transparent font-inter text-[16px] leading-7 text-black outline-none placeholder:text-[var(--cinza-500)] lg:min-h-[calc(100vh-340px)]"
            placeholder="Use Markdown: ## tópico, **decisão**, - pendência..."
        />
    );
}

function TituloRegistro({
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
                    aria-label="Título do registro"
                    className={campoClassName}
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setEditando(true)}
                    title={valor || 'Registro'}
                    className="block w-full min-w-0 text-left"
                    aria-label="Editar título do registro"
                >
                    <Title2 as="span" className={`block truncate ${textoClassName}`}>
                        {valor || 'Registro'}
                    </Title2>
                </button>
            )}
        </div>
    );
}

function Registro() {
    const navigate = useNavigate();
    const { registroId: registroIdParam } = useParams();
    const [searchParams] = useSearchParams();
    const registroId = normalizarIdUrl(
        registroIdParam || searchParams.get('id') || searchParams.get('registroId'),
    );
    const projetoId = normalizarIdUrl(
        searchParams.get('projetoId') ||
            searchParams.get('projectId') ||
            searchParams.get('projeto_id'),
    );

    const [registro, setRegistro] = useState(registroPadrao);
    const [titulo, setTitulo] = useState(registroPadrao.titulo);
    const [conteudo, setConteudo] = useState(registroPadrao.conteudo);
    const [tituloOriginal, setTituloOriginal] = useState(registroPadrao.titulo);
    const [conteudoOriginal, setConteudoOriginal] = useState(registroPadrao.conteudo);
    const [documentosDestino, setDocumentosDestino] = useState([]);
    const [erro, setErro] = useState('');
    const [aviso, setAviso] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [editandoConteudo, setEditandoConteudo] = useState(false);
    const [sugestaoAberta, setSugestaoAberta] = useState(false);
    const [trechoSelecionado, setTrechoSelecionado] = useState('');
    const [gatilhoSugestao, setGatilhoSugestao] = useState(null);
    const [confirmacaoExcluirAberta, setConfirmacaoExcluirAberta] = useState(false);
    const [nomeConfirmacaoExcluir, setNomeConfirmacaoExcluir] = useState('');
    const [erroConfirmacaoExcluir, setErroConfirmacaoExcluir] = useState('');

    const registroNovo = !registroId && Boolean(projetoId);
    const temAlteracao = registroNovo || titulo !== tituloOriginal || conteudo !== conteudoOriginal;
    const conteudoEmEdicao = editandoConteudo || conteudo !== conteudoOriginal;
    const ultimaAlteracao = primeiroValor(
        registro,
        ['ultima_alteracao', 'atualizado_em', 'updated_at'],
        registroPadrao.ultima_alteracao,
    );
    const dataCriacao = primeiroValor(
        registro,
        ['data_criacao', 'criado_em', 'created_at', 'criacao'],
        registroPadrao.data_criacao,
    );
    const documentosDisponiveis = useMemo(() => documentosDestino, [documentosDestino]);

    useEffect(() => {
        async function carregarRegistro() {
            if (!registroId) {
                setRegistro(registroPadrao);
                setTitulo(registroPadrao.titulo);
                setConteudo(registroPadrao.conteudo);
                setTituloOriginal(registroPadrao.titulo);
                setConteudoOriginal(registroPadrao.conteudo);
                setErro(projetoId ? '' : 'Informe o ID do registro na URL.');
                setEditandoConteudo(false);
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);
                setErro('');

                const registroApi = await getRegisterById(registroId);
                const proximoRegistro = registroApi || registroPadrao;
                const proximoTitulo = proximoRegistro.titulo || 'Registro';
                const proximoConteudo = proximoRegistro.conteudo || '';

                setRegistro(proximoRegistro);
                setTitulo(proximoTitulo);
                setConteudo(proximoConteudo);
                setTituloOriginal(proximoTitulo);
                setConteudoOriginal(proximoConteudo);
                setEditandoConteudo(false);
            } catch (error) {
                setErro(getApiErrorMessage(error, 'Erro ao carregar registro.'));
            } finally {
                setCarregando(false);
            }
        }

        carregarRegistro();
    }, [projetoId, registroId]);

    useEffect(() => {
        let ativo = true;

        async function carregarDocumentos() {
            try {
                const dashboard = await getDashboard();
                const documentos = (dashboard?.documentos || [])
                    .map(normalizarDocumentoDestino)
                    .filter(Boolean);

                if (ativo && documentos.length > 0) {
                    setDocumentosDestino(documentos);
                }
            } catch {
                if (ativo) {
                    setDocumentosDestino([]);
                }
            }
        }

        carregarDocumentos();

        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        if (!gatilhoSugestao) {
            return undefined;
        }

        function fecharGatilho() {
            setGatilhoSugestao(null);
        }

        window.addEventListener('click', fecharGatilho);
        window.addEventListener('scroll', fecharGatilho, true);

        return () => {
            window.removeEventListener('click', fecharGatilho);
            window.removeEventListener('scroll', fecharGatilho, true);
        };
    }, [gatilhoSugestao]);

    function alterarTitulo(event) {
        setTitulo(event.target.value.replace(/\s*\n\s*/g, ' '));
    }

    function mostrarGatilhoSugestao({ trecho, x, y }) {
        if (!trecho.trim()) {
            return;
        }

        setTrechoSelecionado(trecho.trim());
        setGatilhoSugestao({ x, y });
        setAviso('');
        setErro('');
    }

    function abrirSugestaoComTrecho() {
        if (!registroId) {
            setGatilhoSugestao(null);
            setErro('Abra um registro salvo antes de criar uma sugestão.');
            return;
        }

        if (!trechoSelecionado.trim()) {
            return;
        }

        setGatilhoSugestao(null);
        setSugestaoAberta(true);
    }

    function abrirSugestaoDoPreview(event) {
        const trecho = textoSelecionadoDentro(event.currentTarget);

        if (!trecho) {
            return;
        }

        event.preventDefault();
        mostrarGatilhoSugestao({ trecho, x: event.clientX, y: event.clientY });
    }

    function abrirSugestaoDoEditor(event) {
        const { selectionStart, selectionEnd, value } = event.currentTarget;
        const trecho =
            selectionStart !== selectionEnd ? value.slice(selectionStart, selectionEnd) : '';

        if (!trecho.trim()) {
            return;
        }

        event.preventDefault();
        mostrarGatilhoSugestao({ trecho, x: event.clientX, y: event.clientY });
    }

    async function enviarSugestao(destinos) {
        if (!registroId) {
            throw new Error('Abra um registro salvo antes de criar uma sugestão.');
        }

        const registroReferenciaId = Number(registroId);
        const conteudoSugestao = limparMarkdownTexto(trechoSelecionado);

        await Promise.all(
            destinos.map((destino) =>
                createDocumentComment({
                    documento_id: destino.documentoId,
                    conteudo: conteudoSugestao,
                    parent_id: null,
                    registro_referencia_id: Number.isNaN(registroReferenciaId)
                        ? registroId
                        : registroReferenciaId,
                    comentario_tipo_id: 3,
                }),
            ),
        );

        window.getSelection?.()?.removeAllRanges?.();
        setAviso(
            destinos.length > 1
                ? 'Sugestão enviada para os comentários dos documentos.'
                : 'Sugestão enviada para os comentários do documento.',
        );
    }

    async function salvarRegistro() {
        const tituloTratado = titulo.trim();

        if (!tituloTratado) {
            setErro('Informe o título do registro.');
            return;
        }

        if (tituloTratado.length > 150) {
            setErro('O título do registro deve ter no máximo 150 caracteres.');
            return;
        }

        if (!registroId) {
            if (!projetoId) {
                setErro('Informe o ID do registro ou o ID do projeto na URL.');
                return;
            }

            try {
                setSalvando(true);
                setErro('');
                const novoRegistro = await createRegister({
                    projeto_id: projetoId,
                    titulo: tituloTratado,
                    conteudo,
                });

                navigate(`/registro/${novoRegistro.id}`);
            } catch (error) {
                setErro(getApiErrorMessage(error, 'Erro ao criar registro.'));
            } finally {
                setSalvando(false);
            }
            return;
        }

        try {
            setSalvando(true);
            setErro('');

            if (tituloTratado !== tituloOriginal) {
                await updateRegisterTitle({ registro_id: registroId, titulo: tituloTratado });
            }

            if (conteudo !== conteudoOriginal) {
                await updateRegisterContent({ registro_id: registroId, conteudo });
            }

            const registroAtualizado = await getRegisterById(registroId);
            const proximoTitulo = registroAtualizado?.titulo || tituloTratado;
            const proximoConteudo = registroAtualizado?.conteudo || '';

            setRegistro(registroAtualizado);
            setTitulo(proximoTitulo);
            setConteudo(proximoConteudo);
            setTituloOriginal(proximoTitulo);
            setConteudoOriginal(proximoConteudo);
            setEditandoConteudo(false);
        } catch (error) {
            setErro(getApiErrorMessage(error, 'Erro ao salvar registro.'));
        } finally {
            setSalvando(false);
        }
    }

    function abrirConfirmacaoExcluirRegistro() {
        if (!registroId) {
            setErro('Informe o ID do registro na URL.');
            return;
        }

        setNomeConfirmacaoExcluir('');
        setErroConfirmacaoExcluir('');
        setConfirmacaoExcluirAberta(true);
    }

    function fecharConfirmacaoExcluirRegistro() {
        if (excluindo) {
            return;
        }

        setConfirmacaoExcluirAberta(false);
        setNomeConfirmacaoExcluir('');
        setErroConfirmacaoExcluir('');
    }

    async function excluirRegistro(event) {
        event?.preventDefault();

        if (!registroId || excluindo) {
            if (!registroId) {
                setErro('Informe o ID do registro na URL.');
            }
            return;
        }

        const nomeEsperado = (titulo || tituloOriginal || '').trim();
        const nomeDigitado = nomeConfirmacaoExcluir.trim();

        if (
            !nomeEsperado ||
            nomeDigitado.toLocaleLowerCase('pt-BR') !== nomeEsperado.toLocaleLowerCase('pt-BR')
        ) {
            setErroConfirmacaoExcluir('Digite o nome do registro para confirmar a exclusão.');
            return;
        }

        try {
            setExcluindo(true);
            setErro('');
            setErroConfirmacaoExcluir('');
            await deleteRegister(registroId);
            voltarTelaAnterior();
        } catch (error) {
            const mensagem =
                error.status === 500
                    ? 'Não foi possível excluir este registro agora. Ele pode estar vinculado a comentários ou outro conteúdo.'
                    : getApiErrorMessage(error, 'Erro ao excluir registro.');

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
                    <div className="relative z-30 border-b border-[var(--cinza-400)] pb-2 lg:hidden">
                        <div className="mb-1 flex min-w-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={voltarTelaAnterior}
                                aria-label="Voltar"
                                className="shrink-0"
                            >
                                <ChevronsLeft className="h-8 w-8 text-gray-900" strokeWidth={3} />
                            </button>

                            <TituloRegistro
                                valor={titulo}
                                onChange={alterarTitulo}
                                className="h-10 flex-1"
                                textoClassName="text-[22px] font-semibold leading-10 text-black sm:text-[26px]"
                                campoClassName="h-10 w-full rounded-sm border border-[var(--cinza-600)] bg-transparent px-1 font-inter text-[22px] font-semibold leading-10 text-black outline-none sm:text-[26px]"
                            />
                        </div>

                        <div className="min-w-0 pl-8">
                            {temAlteracao ? (
                                <div className="inline-flex max-w-full rounded-full bg-[#ffd6d6] px-4 py-0.5">
                                    <ParagraphMedium className="truncate text-[var(--color-alert)]">
                                        Alterações não salvas!
                                    </ParagraphMedium>
                                </div>
                            ) : (
                                <div className="inline-flex max-w-full rounded-full bg-[var(--roxo-light)] px-4 py-0.5">
                                    <ParagraphMedium className="truncate text-[var(--color-variant)]">
                                        Última Alteração: {formatarData(ultimaAlteracao)}
                                    </ParagraphMedium>
                                </div>
                            )}
                            <ParagraphMedium className="mt-1 text-black">
                                Data de criação: {formatarData(dataCriacao)}
                            </ParagraphMedium>
                        </div>
                    </div>

                    <div className="relative z-30 hidden border-b border-[var(--cinza-400)] pb-2 lg:block lg:min-h-[86px]">
                        <div className="flex min-h-[76px] items-start justify-between gap-6">
                            <div className="min-w-0">
                                <div className="mb-1 flex min-w-0 items-center gap-3">
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
                                    <TituloRegistro
                                        valor={titulo}
                                        onChange={alterarTitulo}
                                        className="h-12 w-full max-w-[560px]"
                                        textoClassName="text-[30px] font-semibold leading-[48px] text-[var(--cinza-700)] xl:text-[34px]"
                                        campoClassName="h-12 w-full rounded-sm border border-[var(--cinza-600)] bg-transparent px-1 font-inter text-[30px] font-semibold leading-[48px] text-[var(--cinza-700)] outline-none xl:text-[34px]"
                                    />
                                </div>

                                <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
                                    {temAlteracao ? (
                                        <div className="inline-flex min-h-5 max-w-[250px] items-center rounded-full bg-[#ffd6d6] px-6 text-center">
                                            <ParagraphMedium className="truncate text-[var(--color-alert)]">
                                                Alterações não salvas!
                                            </ParagraphMedium>
                                        </div>
                                    ) : (
                                        <div className="inline-flex min-h-5 max-w-[260px] items-center rounded-full bg-[var(--roxo-light)] px-6 text-center">
                                            <ParagraphMedium className="truncate text-[var(--color-variant)]">
                                                Última alteração: {formatarData(ultimaAlteracao)}
                                            </ParagraphMedium>
                                        </div>
                                    )}
                                    <ParagraphMedium className="text-black">
                                        Data de criação: {formatarData(dataCriacao)}
                                    </ParagraphMedium>
                                </div>
                            </div>

                            <button
                                className="mt-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                                type="button"
                                onClick={abrirConfirmacaoExcluirRegistro}
                                disabled={excluindo}
                                aria-label="Excluir registro"
                            >
                                <Trash2 className="h-6 w-6" strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {erro && (
                        <ParagraphMedium className="mt-2 text-[var(--color-alert)]">
                            {erro}
                        </ParagraphMedium>
                    )}
                    {aviso && (
                        <ParagraphMedium className="mt-2 text-[var(--color-verde)]">
                            {aviso}
                        </ParagraphMedium>
                    )}

                    <div className="relative z-10 mt-3 min-h-[528px] rounded-[22px] border border-[var(--cinza-300)] bg-white px-9 py-8 text-black  sm:px-10 lg:mt-[20px] lg:min-h-[calc(100vh-260px)] lg:rounded-xl lg:px-8 lg:py-8 lg:shadow-none">
                        {carregando ? (
                            <ParagraphMedium className="text-[var(--cinza-600)]">
                                Carregando registro...
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
                                onContextMenu={abrirSugestaoDoEditor}
                            />
                        ) : (
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                    if (textoSelecionadoDentro(event.currentTarget)) {
                                        return;
                                    }

                                    setEditandoConteudo(true);
                                }}
                                onContextMenu={abrirSugestaoDoPreview}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setEditandoConteudo(true);
                                    }
                                }}
                                className="block min-h-[464px] w-full cursor-text select-text overflow-y-auto pb-20 text-left outline-none lg:min-h-[calc(100vh-340px)]"
                                aria-label="Editar conteúdo do registro"
                            >
                                <MarkdownPreview valor={conteudo} />
                            </div>
                        )}

                        {temAlteracao && (
                            <button
                                type="button"
                                onClick={salvarRegistro}
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
                </section>
            </main>

            {gatilhoSugestao && (
                <button
                    type="button"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        abrirSugestaoComTrecho();
                    }}
                    className="fixed z-40 flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-base)] bg-white px-4 py-2 text-[var(--color-base)] shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--roxo-light)]"
                    style={{
                        left: `min(${gatilhoSugestao.x}px, calc(100vw - 190px))`,
                        top: `min(${gatilhoSugestao.y}px, calc(100vh - 56px))`,
                    }}
                    aria-label="Criar sugestão com o trecho selecionado"
                >
                    <Lightbulb size={19} />
                    <ParagraphMedium as="span" className="font-semibold text-[var(--color-base)]">
                        Criar sugestão
                    </ParagraphMedium>
                </button>
            )}

            {sugestaoAberta && (
                <Sugestao
                    trecho={trechoSelecionado}
                    documentos={documentosDisponiveis}
                    onFechar={() => setSugestaoAberta(false)}
                    onEnviar={enviarSugestao}
                />
            )}

            {confirmacaoExcluirAberta && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/25 px-4 py-6">
                    <form
                        onSubmit={excluirRegistro}
                        className="relative w-full max-w-[calc(100vw-24px)] rounded-[34px] bg-white px-8 py-11 shadow-[var(--external-shadow)] sm:px-10 lg:max-w-[900px] lg:rounded-[28px] lg:px-16 lg:py-10"
                    >
                        <button
                            type="button"
                            onClick={fecharConfirmacaoExcluirRegistro}
                            disabled={excluindo}
                            className="absolute right-5 top-5 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)] disabled:opacity-50 lg:right-9 lg:top-9"
                            aria-label="Fechar confirmação"
                        >
                            <X className="h-5 w-5 lg:h-7 lg:w-7" strokeWidth={3.4} />
                        </button>

                        <Title2 className="pr-7 text-left text-[30px] leading-tight text-black lg:pr-8 lg:text-center lg:text-[28px]">
                            Tem certeza que deseja deletar este registro?
                        </Title2>

                        <div className="mx-auto mt-9 w-full lg:mt-14 lg:max-w-[520px]">
                            <ParagraphMedium className="mb-2 text-center text-xl font-semibold text-[var(--color-dark)] lg:text-xl">
                                Para prosseguir digite o nome do registro
                            </ParagraphMedium>
                            <ParagraphMedium className="mb-4 break-words text-center font-semibold text-[var(--cinza-700)] [overflow-wrap:anywhere]">
                                {titulo || tituloOriginal || 'Registro'}
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
                                placeholder="Digite o nome do registro"
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

export default Registro;
