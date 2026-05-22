import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsLeft, Menu, Send, X } from 'lucide-react';
import logotipoMobile from '../../../assets/logotipo-mobile.svg';
import { createDocumentComment, getDocumentComments } from '../../../services/api';

function primeiroValor(objeto, campos, fallback = '') {
    for (const campo of campos) {
        if (objeto?.[campo] !== undefined && objeto?.[campo] !== null && objeto?.[campo] !== '') {
            return objeto[campo];
        }
    }

    return fallback;
}

function formatarDataHora(data) {
    if (!data) {
        return { data: '', horario: '' };
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return { data: '', horario: '' };
    }

    return {
        data: dataObj.toLocaleDateString('pt-BR'),
        horario: dataObj.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }),
    };
}

function iniciais(nome) {
    return String(nome || 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase();
}

function normalizarBooleano(valor) {
    if (typeof valor === 'boolean') {
        return valor;
    }

    if (typeof valor === 'number') {
        return valor === 1;
    }

    if (typeof valor === 'string') {
        return ['1', 'true', 'sim', 'concluido', 'concluído', 'resolvido'].includes(
            valor.toLowerCase(),
        );
    }

    return false;
}

function lerUsuarioAtual() {
    try {
        const usuario = JSON.parse(localStorage.getItem('authUser') || '{}');

        return {
            nome: usuario?.nome || usuario?.name || usuario?.email || 'Usuário',
            foto: usuario?.foto_perfil || usuario?.foto || '',
        };
    } catch {
        return { nome: 'Usuário', foto: '' };
    }
}

function adaptarComentario(comentario, comentariosPorId) {
    const id = primeiroValor(comentario, ['id', 'comentario_id', 'comentarioId']);
    const parentId = primeiroValor(comentario, ['parent_id', 'parentId'], null);
    const registroReferenciaId = primeiroValor(
        comentario,
        ['registro_referencia_id', 'registroReferenciaId'],
        null,
    );
    const tipoId = Number(
        primeiroValor(comentario, ['comentario_tipo_id', 'tipo_comentario_id', 'tipoId'], 1),
    );
    const nome = primeiroValor(
        comentario,
        ['nome_criador', 'criador_nome', 'nome_usuario', 'usuario_nome', 'nome'],
        'Usuário',
    );
    const criadoEm = primeiroValor(comentario, ['criado_em', 'created_at', 'data_criacao']);
    const { data, horario } = formatarDataHora(criadoEm);
    const parent = parentId ? comentariosPorId.get(String(parentId)) : null;

    return {
        id,
        parentId,
        registroReferenciaId,
        tipoId,
        nome,
        cargo: primeiroValor(
            comentario,
            ['cargo', 'perfil', 'papel', 'funcao', 'tipo_usuario'],
            tipoId === 3 ? 'Registro' : '',
        ),
        data,
        horario,
        texto: primeiroValor(comentario, ['conteudo', 'texto', 'comentario'], ''),
        avatar: iniciais(nome),
        foto: primeiroValor(comentario, ['foto_perfil', 'foto', 'avatar']),
        concluido: normalizarBooleano(primeiroValor(comentario, ['concluido', 'resolvido'], false)),
        resposta: parent && {
            autor: primeiroValor(
                parent,
                ['nome_criador', 'criador_nome', 'nome_usuario', 'usuario_nome', 'nome'],
                'Comentário',
            ),
            cargo: primeiroValor(parent, ['cargo', 'perfil', 'papel', 'funcao'], ''),
            texto: primeiroValor(parent, ['conteudo', 'texto', 'comentario'], ''),
        },
        referencia:
            tipoId === 3 || registroReferenciaId
                ? {
                      autor: 'Sugestão de Requisito',
                      cargo: registroReferenciaId ? `Registro ${registroReferenciaId}` : '',
                      texto: '',
                  }
                : null,
    };
}

function prepararComentarios(comentariosApi) {
    const comentarios = Array.isArray(comentariosApi) ? comentariosApi : [];
    const comentariosPorId = new Map(
        comentarios.map((comentario) => [
            String(primeiroValor(comentario, ['id', 'comentario_id', 'comentarioId'])),
            comentario,
        ]),
    );

    return comentarios.map((comentario) => adaptarComentario(comentario, comentariosPorId));
}

function Avatar({ comentario, className = '' }) {
    return (
        <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-base)] bg-[var(--cinza-200)] font-inter text-[14px] font-semibold text-[var(--color-base)] ${className}`}
        >
            {comentario.foto ? (
                <img src={comentario.foto} alt="" className="h-full w-full object-cover" />
            ) : (
                comentario.avatar
            )}
        </div>
    );
}

function ComentarioCard({ comentario, mobile = false, onResponder }) {
    const referencia = comentario.resposta || comentario.referencia;

    return (
        <article className="flex gap-3">
            <Avatar comentario={comentario} className={mobile ? 'h-12 w-12' : ''} />

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-1 font-inter">
                    <span className="font-semibold text-[var(--color-base)]">
                        {comentario.nome}
                    </span>
                    {comentario.cargo && (
                        <span className="truncate font-semibold text-[var(--cinza-300)]">
                            {comentario.cargo}
                        </span>
                    )}
                    {mobile && (
                        <span className="ml-auto shrink-0 text-[12px] text-[var(--cinza-400)]">
                            {comentario.horario} · {comentario.data}
                        </span>
                    )}
                </div>

                <div className="rounded-xl border border-[var(--cinza-600)] px-4 py-2 font-inter text-[14px] leading-5 text-black">
                    {referencia && (
                        <div className="mb-2 rounded bg-[var(--cinza-200)] px-3 py-2">
                            <div className="mb-1 truncate text-[12px] text-[var(--color-base)]">
                                {referencia.autor}{' '}
                                {referencia.cargo && (
                                    <span className="text-[var(--cinza-400)]">
                                        {referencia.cargo}
                                    </span>
                                )}
                            </div>
                            {referencia.texto && (
                                <p className="line-clamp-3 text-[12px] leading-4 text-[var(--cinza-700)]">
                                    {referencia.texto}
                                </p>
                            )}
                        </div>
                    )}

                    <p>{comentario.texto}</p>

                    {!mobile && (
                        <div className="mt-1 text-right text-[14px] text-[var(--cinza-500)]">
                            {comentario.horario} · {comentario.data}
                        </div>
                    )}
                </div>

                <div className="mt-1 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onResponder(comentario)}
                        className="rounded border border-[var(--cinza-700)] px-2 py-1 font-inter text-[14px] text-black"
                    >
                        Responder
                    </button>
                    <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded border border-[var(--cinza-700)] text-[var(--cinza-700)]"
                        aria-label="Concluir comentário"
                    >
                        <Check size={18} />
                    </button>
                </div>
            </div>
        </article>
    );
}

function CampoComentario({
    usuarioAtual,
    valor,
    onChange,
    onSubmit,
    enviando,
    respostaPara,
    onCancelarResposta,
}) {
    return (
        <form className="space-y-2" onSubmit={onSubmit}>
            {respostaPara && (
                <div className="flex items-center justify-between rounded bg-[var(--cinza-200)] px-3 py-2 font-inter text-[12px] text-[var(--cinza-700)]">
                    <span className="truncate">
                        Respondendo {respostaPara.nome}: {respostaPara.texto}
                    </span>
                    <button
                        type="button"
                        onClick={onCancelarResposta}
                        className="ml-2 text-[var(--cinza-700)]"
                        aria-label="Cancelar resposta"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3">
                <Avatar
                    comentario={{
                        avatar: iniciais(usuarioAtual.nome),
                        foto: usuarioAtual.foto,
                    }}
                    className="h-12 w-12"
                />
                <label className="relative flex-1">
                    <span className="sr-only">Escreva seu comentário</span>
                    <input
                        value={valor}
                        onChange={(event) => onChange(event.target.value)}
                        className="h-10 w-full rounded-xl border border-[var(--cinza-600)] bg-white px-4 pr-11 font-inter text-[14px] outline-none placeholder:text-[var(--cinza-500)]"
                        placeholder="Escreva seu comentário"
                        maxLength={500}
                        disabled={enviando}
                    />
                    <button
                        type="submit"
                        disabled={enviando || !valor.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-base)] disabled:opacity-50"
                        aria-label="Enviar comentário"
                    >
                        <Send size={22} />
                    </button>
                </label>
            </div>
        </form>
    );
}

function ListaComentarios({ comentarios, carregando, onResponder, mobile }) {
    if (carregando) {
        return (
            <p className="font-inter text-[14px] text-[var(--cinza-500)]">
                Carregando comentários...
            </p>
        );
    }

    if (comentarios.length === 0) {
        return (
            <p className="font-inter text-[14px] text-[var(--cinza-500)]">
                Nenhum comentário encontrado.
            </p>
        );
    }

    return (
        <div className={`flex flex-col ${mobile ? 'gap-5' : 'gap-8'}`}>
            {comentarios.map((comentario) => (
                <ComentarioCard
                    key={comentario.id}
                    comentario={comentario}
                    mobile={mobile}
                    onResponder={onResponder}
                />
            ))}
        </div>
    );
}

function Comentarios({ documentoId, onFechar, onErro }) {
    const [comentarios, setComentarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');
    const [texto, setTexto] = useState('');
    const [respostaPara, setRespostaPara] = useState(null);
    const [filtro, setFiltro] = useState('abertos');
    const usuarioAtual = useMemo(() => lerUsuarioAtual(), []);

    const comentariosFiltrados = useMemo(() => {
        return comentarios.filter((comentario) =>
            filtro === 'concluidos' ? comentario.concluido : !comentario.concluido,
        );
    }, [comentarios, filtro]);

    async function carregarComentarios() {
        if (!documentoId) {
            setErro('Informe o ID do documento para carregar comentários.');
            setCarregando(false);
            return;
        }

        try {
            setCarregando(true);
            setErro('');
            const comentariosApi = await getDocumentComments(documentoId);
            setComentarios(prepararComentarios(comentariosApi));
        } catch (error) {
            const mensagem = error.message || 'Erro ao carregar comentários.';
            setErro(mensagem);
            onErro?.(mensagem);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        let ativo = true;

        async function carregarComentariosIniciais() {
            if (!documentoId) {
                if (ativo) {
                    setErro('Informe o ID do documento para carregar comentários.');
                    setCarregando(false);
                }
                return;
            }

            try {
                setCarregando(true);
                setErro('');
                const comentariosApi = await getDocumentComments(documentoId);

                if (ativo) {
                    setComentarios(prepararComentarios(comentariosApi));
                }
            } catch (error) {
                const mensagem = error.message || 'Erro ao carregar comentários.';

                if (ativo) {
                    setErro(mensagem);
                    onErro?.(mensagem);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarComentariosIniciais();

        return () => {
            ativo = false;
        };
    }, [documentoId, onErro]);

    async function enviarComentario(event) {
        event.preventDefault();

        if (!texto.trim() || enviando) {
            return;
        }

        try {
            setEnviando(true);
            setErro('');
            await createDocumentComment({
                documento_id: documentoId,
                conteudo: texto.trim(),
                parent_id: respostaPara?.id || null,
                registro_referencia_id: null,
                comentario_tipo_id: respostaPara ? 2 : 1,
            });
            setTexto('');
            setRespostaPara(null);
            await carregarComentarios();
        } catch (error) {
            const mensagem = error.message || 'Erro ao enviar comentário.';
            setErro(mensagem);
            onErro?.(mensagem);
        } finally {
            setEnviando(false);
        }
    }

    const campoComentario = (
        <CampoComentario
            usuarioAtual={usuarioAtual}
            valor={texto}
            onChange={setTexto}
            onSubmit={enviarComentario}
            enviando={enviando}
            respostaPara={respostaPara}
            onCancelarResposta={() => setRespostaPara(null)}
        />
    );

    return (
        <>
            <aside className="fixed bottom-0 right-0 top-0 z-50 hidden w-[430px] flex-col border-l border-[var(--cinza-300)] bg-white shadow-[var(--external-shadow)] lg:flex">
                <header className="px-5 pt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-inter text-[26px] font-semibold text-[var(--cinza-700)]">
                            Comentários
                        </h2>
                        <button type="button" onClick={onFechar} aria-label="Fechar comentários">
                            <X className="text-[var(--cinza-700)]" size={26} />
                        </button>
                    </div>
                    <div className="mt-2 border-b border-[var(--cinza-700)]" />
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFiltro('abertos')}
                            className={`rounded-full px-4 py-1 font-inter text-[14px] ${
                                filtro === 'abertos'
                                    ? 'bg-[var(--roxo-light)] text-[var(--roxo-dark)]'
                                    : 'bg-[var(--cinza-200)] text-[var(--cinza-400)]'
                            }`}
                        >
                            Em aberto
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltro('concluidos')}
                            className={`rounded-full px-4 py-1 font-inter text-[14px] ${
                                filtro === 'concluidos'
                                    ? 'bg-[var(--roxo-light)] text-[var(--roxo-dark)]'
                                    : 'bg-[var(--cinza-200)] text-[var(--cinza-400)]'
                            }`}
                        >
                            Concluídos
                        </button>
                    </div>
                    {erro && (
                        <p className="mt-2 font-inter text-[12px] text-[var(--color-alert)]">
                            {erro}
                        </p>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-8">
                    <ListaComentarios
                        comentarios={comentariosFiltrados}
                        carregando={carregando}
                        onResponder={setRespostaPara}
                    />
                </div>

                <footer className="border-t border-[var(--cinza-700)] px-4 py-3">
                    {campoComentario}
                </footer>
            </aside>

            <section className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
                <header className="flex h-[50px] items-center justify-between bg-[var(--color-base)] px-4">
                    <img src={logotipoMobile} alt="Escopo" className="h-auto w-40" />
                    <button type="button" onClick={onFechar} aria-label="Fechar comentários">
                        <Menu className="text-white" />
                    </button>
                </header>

                <div className="flex items-center gap-1 px-5 py-3">
                    <button
                        type="button"
                        onClick={onFechar}
                        className="text-[var(--cinza-700)]"
                        aria-label="Voltar"
                    >
                        <ChevronsLeft size={30} strokeWidth={3} />
                    </button>
                    <h2 className="font-inter text-[26px] font-semibold text-[var(--cinza-700)]">
                        Comentários
                    </h2>
                </div>

                {erro && (
                    <p className="px-4 pb-2 font-inter text-[12px] text-[var(--color-alert)]">
                        {erro}
                    </p>
                )}

                <div className="flex-1 overflow-y-auto px-4 pb-6">
                    <ListaComentarios
                        comentarios={comentariosFiltrados}
                        carregando={carregando}
                        onResponder={setRespostaPara}
                        mobile
                    />
                </div>

                <footer className="border-t border-[var(--cinza-700)] px-4 py-3">
                    {campoComentario}
                </footer>
            </section>
        </>
    );
}

export default Comentarios;
