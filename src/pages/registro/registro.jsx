import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronsLeft, Lightbulb, Save, Trash2 } from 'lucide-react';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title2 from '../../components/Typography/Title2';
import Title3 from '../../components/Typography/Title3';
import Title4 from '../../components/Typography/Title4';
import {
    createRegister,
    createDocumentComment,
    deleteRegister,
    getRegisterById,
    updateRegisterContent,
    updateRegisterTitle,
} from '../../services/api';
import { getDashboard } from '../dashboard/services/dashboard-endpoints';
import Sugestao from './components/sugestao';

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

function linkSeguro(url) {
    return /^(https?:|mailto:|\/)/i.test(url) ? url : '#';
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
                Clique para começar o registro.
            </ParagraphMedium>
        );
    }

    return <div className="max-w-none">{elementos}</div>;
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
                setErro(error.message || 'Erro ao carregar registro.');
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
        const conteudoSugestao = trechoSelecionado.trim();

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
                    titulo,
                    conteudo,
                });

                navigate(`/registro/${novoRegistro.id}`);
            } catch (error) {
                setErro(error.message || 'Erro ao criar registro.');
            } finally {
                setSalvando(false);
            }
            return;
        }

        try {
            setSalvando(true);
            setErro('');

            if (titulo !== tituloOriginal) {
                await updateRegisterTitle({ registro_id: registroId, titulo });
            }

            if (conteudo !== conteudoOriginal) {
                await updateRegisterContent({ registro_id: registroId, conteudo });
            }

            const registroAtualizado = await getRegisterById(registroId);
            const proximoTitulo = registroAtualizado?.titulo || titulo;
            const proximoConteudo = registroAtualizado?.conteudo || '';

            setRegistro(registroAtualizado);
            setTitulo(proximoTitulo);
            setConteudo(proximoConteudo);
            setTituloOriginal(proximoTitulo);
            setConteudoOriginal(proximoConteudo);
            setEditandoConteudo(false);
        } catch (error) {
            setErro(error.message || 'Erro ao salvar registro.');
        } finally {
            setSalvando(false);
        }
    }

    async function excluirRegistro() {
        if (!registroId || excluindo) {
            if (!registroId) {
                setErro('Informe o ID do registro na URL.');
            }
            return;
        }

        const confirmar = window.confirm('Tem certeza que deseja excluir este registro?');

        if (!confirmar) {
            return;
        }

        try {
            setExcluindo(true);
            setErro('');
            await deleteRegister(registroId);
            navigate('/dashboard');
        } catch (error) {
            setErro(error.message || 'Erro ao excluir registro.');
        } finally {
            setExcluindo(false);
        }
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
                                onClick={excluirRegistro}
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
        </div>
    );
}

export default Registro;
