import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronsLeft, ClockFading, Lightbulb, Save, Trash2 } from 'lucide-react';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import ParagraphLarge from '../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title2 from '../../components/Typography/Title2';
import Title3 from '../../components/Typography/Title3';
import Title4 from '../../components/Typography/Title4';
import Sugestao from './components/sugestao';

const registroPadrao = {
    titulo: 'Registro de reunião',
    conteudo:
        '## Pauta\n\n- Alinhamento sobre escopo inicial\n- Decisões pendentes\n- Próximos passos\n\n## Decisões\n\nRegistre aqui os pontos definidos durante a reunião.',
    nome_projeto: 'Projeto Integrado',
    setor: 'Página Web',
    responsavel: 'Equipe Escopo',
    ultima_alteracao: '2026-05-28T10:00:00Z',
};

const sugestoesPadrao = [
    {
        id: 1,
        titulo: 'Criar requisito a partir da decisão principal',
        descricao:
            'Transformar a decisão registrada na seção de decisões em um requisito funcional vinculado ao documento.',
        origem: 'Registro',
        status: 'pendente',
    },
    {
        id: 2,
        titulo: 'Validar pendências com o responsável',
        descricao:
            'Conferir se os próximos passos possuem responsável e prazo antes de fechar o registro.',
        origem: 'Registro',
        status: 'pendente',
    },
];

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

        const texto = paragrafoAtual.join(' ');

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

function EditorMarkdown({ valor, onChange, onBlur }) {
    return (
        <textarea
            value={valor}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
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

function chaveRegistro(registroId) {
    return `registro:${registroId || 'rascunho'}`;
}

function Registro() {
    const navigate = useNavigate();
    const { registroId: registroIdParam } = useParams();
    const [searchParams] = useSearchParams();
    const registroId = registroIdParam || searchParams.get('id') || searchParams.get('registroId');

    const [registro, setRegistro] = useState(registroPadrao);
    const [titulo, setTitulo] = useState(registroPadrao.titulo);
    const [conteudo, setConteudo] = useState(registroPadrao.conteudo);
    const [tituloOriginal, setTituloOriginal] = useState(registroPadrao.titulo);
    const [conteudoOriginal, setConteudoOriginal] = useState(registroPadrao.conteudo);
    const [sugestoes, setSugestoes] = useState(sugestoesPadrao);
    const [sugestoesOriginal, setSugestoesOriginal] = useState(sugestoesPadrao);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [editandoConteudo, setEditandoConteudo] = useState(false);
    const [sugestoesAbertas, setSugestoesAbertas] = useState(false);

    const sugestoesSerializadas = useMemo(() => JSON.stringify(sugestoes), [sugestoes]);
    const sugestoesOriginaisSerializadas = useMemo(
        () => JSON.stringify(sugestoesOriginal),
        [sugestoesOriginal],
    );

    const temAlteracao =
        titulo !== tituloOriginal ||
        conteudo !== conteudoOriginal ||
        sugestoesSerializadas !== sugestoesOriginaisSerializadas;
    const conteudoEmEdicao = editandoConteudo || conteudo !== conteudoOriginal;

    const nomeProjeto = primeiroValor(
        registro,
        ['nome_projeto', 'projeto_nome', 'projeto'],
        'Projeto Integrado',
    );
    const setorRegistro = primeiroValor(registro, ['setor_nome', 'nome_setor', 'setor'], 'Página Web');
    const responsavelRegistro = primeiroValor(
        registro,
        ['responsavel', 'nome_responsavel', 'autor'],
        'Equipe Escopo',
    );

    useEffect(() => {
        function carregarRegistro() {
            try {
                setCarregando(true);
                setErro('');

                const registroSalvo = localStorage.getItem(chaveRegistro(registroId));
                const dados = registroSalvo ? JSON.parse(registroSalvo) : null;
                const proximoRegistro = dados?.registro || registroPadrao;
                const proximasSugestoes = dados?.sugestoes || sugestoesPadrao;
                const proximoTitulo = proximoRegistro.titulo || 'Registro';
                const proximoConteudo = proximoRegistro.conteudo || '';

                setRegistro(proximoRegistro);
                setTitulo(proximoTitulo);
                setConteudo(proximoConteudo);
                setTituloOriginal(proximoTitulo);
                setConteudoOriginal(proximoConteudo);
                setSugestoes(proximasSugestoes);
                setSugestoesOriginal(proximasSugestoes);
                setEditandoConteudo(false);
            } catch (error) {
                setErro(error.message || 'Erro ao carregar registro.');
            } finally {
                setCarregando(false);
            }
        }

        carregarRegistro();
    }, [registroId]);

    function alterarTitulo(event) {
        setTitulo(event.target.value.replace(/\s*\n\s*/g, ' '));
    }

    function adicionarSugestao(texto) {
        const novaSugestao = {
            id: crypto.randomUUID?.() || `${Date.now()}`,
            titulo: texto,
            descricao: 'Sugestão adicionada manualmente neste registro.',
            origem: 'Registro',
            status: 'pendente',
        };

        setSugestoes((sugestoesAtuais) => [novaSugestao, ...sugestoesAtuais]);
    }

    function alternarStatusSugestao(sugestaoId) {
        setSugestoes((sugestoesAtuais) =>
            sugestoesAtuais.map((sugestao) =>
                sugestao.id === sugestaoId
                    ? {
                          ...sugestao,
                          status: sugestao.status === 'concluida' ? 'pendente' : 'concluida',
                      }
                    : sugestao,
            ),
        );
    }

    async function salvarRegistro() {
        try {
            setSalvando(true);
            setErro('');

            const registroAtualizado = {
                ...registro,
                titulo,
                conteudo,
                ultima_alteracao: new Date().toISOString(),
            };

            localStorage.setItem(
                chaveRegistro(registroId),
                JSON.stringify({
                    registro: registroAtualizado,
                    sugestoes,
                }),
            );

            setRegistro(registroAtualizado);
            setTituloOriginal(titulo);
            setConteudoOriginal(conteudo);
            setSugestoesOriginal(sugestoes);
            setEditandoConteudo(false);
        } catch (error) {
            setErro(error.message || 'Erro ao salvar registro.');
        } finally {
            setSalvando(false);
        }
    }

    function excluirRegistro() {
        if (excluindo) {
            return;
        }

        const confirmar = window.confirm('Tem certeza que deseja excluir este registro?');

        if (!confirmar) {
            return;
        }

        try {
            setExcluindo(true);
            localStorage.removeItem(chaveRegistro(registroId));
            navigate('/dashboard');
        } catch (error) {
            setErro(error.message || 'Erro ao excluir registro.');
        } finally {
            setExcluindo(false);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--fundo)] lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="flex-1 px-4 pb-4 pt-3 sm:px-8 lg:px-7 lg:pb-8 lg:pt-10 xl:px-7">
                <section className="relative mx-auto max-w-[700px] lg:max-w-none">
                    {sugestoesAbertas && (
                        <div className="fixed inset-0 z-20 bg-black/20 lg:left-[280px] xl:left-[356px]" />
                    )}

                    <div className="relative z-30 border-b border-[var(--cinza-400)] pb-2 lg:hidden">
                        <div className="mb-2 flex min-w-0 items-center gap-3">
                            <Link to="/dashboard" aria-label="Voltar" className="shrink-0">
                                <ChevronsLeft className="h-8 w-8 text-gray-900" strokeWidth={3} />
                            </Link>

                            <TituloRegistro
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
                                        Última alteração: {formatarData(registro.ultima_alteracao)}
                                    </ParagraphMedium>
                                )}
                            </div>

                            <button
                                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)]"
                                type="button"
                                onClick={() => setSugestoesAbertas(true)}
                                aria-label="Sugestões"
                            >
                                <Lightbulb className="h-6 w-6" strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    <div className="relative z-30 hidden border-b border-[var(--cinza-400)] pb-3 lg:block lg:min-h-[84px]">
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(190px,280px)_112px] lg:items-start">
                            <div className="min-w-0">
                                <div className="mb-2 flex min-w-0 items-center gap-3 lg:mb-1 lg:pl-12 xl:pl-16">
                                    <TituloRegistro
                                        valor={titulo}
                                        onChange={alterarTitulo}
                                        className="h-12 w-full max-w-[560px]"
                                        textoClassName="text-[30px] font-semibold leading-[48px] text-[var(--cinza-700)] xl:text-[34px]"
                                        campoClassName="h-12 w-full rounded-sm border border-[var(--cinza-600)] bg-transparent px-1 font-inter text-[30px] font-semibold leading-[48px] text-[var(--cinza-700)] outline-none xl:text-[34px]"
                                    />
                                </div>

                                {temAlteracao ? (
                                    <ParagraphMedium className="break-words text-[var(--color-alert)] [overflow-wrap:anywhere] lg:ml-12 xl:ml-16">
                                        Alterações não salvas!
                                    </ParagraphMedium>
                                ) : (
                                    <div className="flex min-h-8 w-full max-w-[420px] items-center justify-center gap-3 rounded-full border border-[var(--color-base)] px-4 py-1 text-center text-[var(--color-base)] lg:ml-8 xl:ml-12">
                                        <ParagraphLarge
                                            as="span"
                                            className="min-w-0 break-words text-[var(--color-base)] [overflow-wrap:anywhere]"
                                        >
                                            Última alteração: {formatarData(registro.ultima_alteracao)}
                                        </ParagraphLarge>
                                        <ClockFading
                                            className="h-6 w-6 shrink-0 text-[var(--color-base)]"
                                            strokeWidth={2}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 break-words text-gray-900 [overflow-wrap:anywhere] lg:pt-2">
                                <ParagraphLarge className="leading-6">{nomeProjeto}</ParagraphLarge>
                                <ParagraphLarge className="leading-6">
                                    Setor: {setorRegistro}
                                </ParagraphLarge>
                                <ParagraphLarge className="leading-6">
                                    Responsável: {responsavelRegistro}
                                </ParagraphLarge>
                            </div>

                            <div className="flex shrink-0 items-center gap-6 lg:justify-end lg:pt-1">
                                <button
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                                    type="button"
                                    onClick={excluirRegistro}
                                    disabled={excluindo}
                                    aria-label="Excluir registro"
                                >
                                    <Trash2 className="h-6 w-6" strokeWidth={2} />
                                </button>

                                <button
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)]"
                                    type="button"
                                    onClick={() => setSugestoesAbertas(true)}
                                    aria-label="Sugestões"
                                >
                                    <Lightbulb className="h-6 w-6" strokeWidth={2} />
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

            {sugestoesAbertas && (
                <Sugestao
                    sugestoes={sugestoes}
                    onFechar={() => setSugestoesAbertas(false)}
                    onAdicionarSugestao={adicionarSugestao}
                    onAlternarStatus={alternarStatusSugestao}
                />
            )}
        </div>
    );
}

export default Registro;
