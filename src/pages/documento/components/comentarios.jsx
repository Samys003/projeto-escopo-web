import { useEffect, useMemo, useState } from 'react';
import { ChevronsLeft, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '../../../components/MobileHeader';
import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import ParagraphSmall from '../../../components/Typography/ParagraphSmall';
import Title2 from '../../../components/Typography/Title2';
import { createDocumentComment, getDocumentComments, getRegisterById } from '../../../services/api';
import { limparMarkdownTexto } from '../../../utils/markdown-text';

function pegar(objeto, campos, fallback = '') {
    for (const campo of campos) {
        const valor = objeto?.[campo];

        if (valor !== undefined && valor !== null && valor !== '') {
            return valor;
        }
    }

    return fallback;
}

function pegarObjeto(objeto, campos) {
    const valor = pegar(objeto, campos, null);

    if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
        return valor;
    }

    if (typeof valor === 'string') {
        try {
            const json = JSON.parse(valor);

            return json && typeof json === 'object' && !Array.isArray(json) ? json : null;
        } catch {
            return null;
        }
    }

    return null;
}

function textoDoValor(valor) {
    if (valor === undefined || valor === null || valor === '') {
        return '';
    }

    if (typeof valor === 'object') {
        return pegar(valor, ['nome', 'titulo', 'descricao', 'label'], '');
    }

    return String(valor);
}

function formatarDataHora(data) {
    const dataObj = data ? new Date(data) : null;

    if (!dataObj || Number.isNaN(dataObj.getTime())) {
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

function timestampSeguro(data) {
    const timestamp = new Date(data || '').getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function ordenarComentarios(comentarios) {
    return [...comentarios].sort((a, b) => {
        const diferencaData = b.ordem - a.ordem;
        const idA = Number(a.id || 0);
        const idB = Number(b.id || 0);

        if (diferencaData !== 0) {
            return diferencaData;
        }

        return (Number.isNaN(idB) ? 0 : idB) - (Number.isNaN(idA) ? 0 : idA);
    });
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

function lerUsuarioAtual() {
    try {
        const usuario = JSON.parse(localStorage.getItem('authUser') || '{}');

        return {
            id: pegar(usuario, ['id', 'usuario_id', 'usuarioId'], null),
            nome: pegar(usuario, ['nome', 'name', 'email'], 'Usuário'),
            cargo: textoDoValor(
                pegar(
                    usuario,
                    [
                        'cargo',
                        'perfil',
                        'papel',
                        'funcao',
                        'tipo_usuario',
                        'tipoUsuario',
                        'nivel_acesso',
                        'nivel_acesso_nome',
                    ],
                    '',
                ),
            ),
            foto: pegar(usuario, ['foto_perfil', 'foto', 'avatar'], ''),
        };
    } catch {
        return { id: null, nome: 'Usuário', cargo: '', foto: '' };
    }
}

function idComentario(comentario) {
    return pegar(comentario, ['id', 'comentario_id', 'comentarioId', 'parent_id'], null);
}

function autorIdComentario(comentario) {
    return pegar(comentario, ['autor_id', 'criador_id', 'usuario_id', 'user_id'], null);
}

function parentIdComentario(comentario) {
    return pegar(
        comentario,
        [
            'parent_id',
            'parentId',
            'comentario_pai_id',
            'comentarioPaiId',
            'comentario_parent_id',
            'comentarioParentId',
            'resposta_para_id',
            'respostaParaId',
        ],
        null,
    );
}

function textoComentario(comentario) {
    return pegar(
        comentario,
        ['conteudo', 'texto', 'comentario', 'mensagem', 'parent_conteudo'],
        '',
    );
}

function autorComentario(comentario) {
    const usuario = pegarObjeto(comentario, ['usuario', 'criador', 'autor', 'user']);
    const nome = pegar(
        comentario,
        [
            'autor_nome',
            'nome_criador',
            'criador_nome',
            'nome_usuario',
            'usuario_nome',
            'parent_autor_nome',
            'nome',
            'name',
        ],
        pegar(usuario, ['nome', 'name', 'email'], 'Usuário'),
    );
    const cargo =
        textoDoValor(
            pegar(
                comentario,
                [
                    'cargo',
                    'perfil',
                    'papel',
                    'funcao',
                    'tipo_usuario',
                    'tipoUsuario',
                    'nivel_acesso',
                    'nivel_acesso_nome',
                    'autor_cargo',
                    'autor_nivel_acesso',
                    'autor_nivel_acesso_nome',
                    'parent_autor_nivel_acesso',
                ],
                '',
            ),
        ) ||
        textoDoValor(
            pegar(
                usuario,
                [
                    'cargo',
                    'perfil',
                    'papel',
                    'funcao',
                    'tipo_usuario',
                    'tipoUsuario',
                    'nivel_acesso',
                    'nivel_acesso_nome',
                ],
                '',
            ),
        );

    return {
        nome,
        cargo,
        foto:
            pegar(comentario, ['foto_perfil', 'foto', 'avatar'], '') ||
            pegar(usuario, ['foto_perfil', 'foto', 'avatar'], ''),
    };
}

function referenciaComentario(comentario) {
    if (!comentario) {
        return null;
    }

    const texto = textoComentario(comentario);

    if (!texto) {
        return null;
    }

    const autor = autorComentario(comentario);

    return {
        autor: autor.nome,
        cargo: autor.cargo,
        texto,
    };
}

function referenciaRespostaDireta(comentario) {
    const texto = pegar(
        comentario,
        [
            'parent_texto',
            'parent_conteudo',
            'comentario_pai_texto',
            'comentario_pai_conteudo',
            'resposta_texto',
            'resposta_conteudo',
            'texto_resposta',
            'conteudo_resposta',
            'mensagem_respondida',
        ],
        '',
    );

    if (!texto) {
        return null;
    }

    return {
        autor: pegar(
            comentario,
            [
                'parent_nome',
                'parent_autor',
                'comentario_pai_nome',
                'comentario_pai_autor',
                'resposta_nome',
                'resposta_autor',
                'nome_resposta',
            ],
            'Comentário',
        ),
        cargo: pegar(
            comentario,
            [
                'parent_cargo',
                'parent_autor_nivel_acesso',
                'comentario_pai_cargo',
                'cargo_comentario_pai',
                'resposta_cargo',
                'cargo_resposta',
            ],
            '',
        ),
        texto,
    };
}

function adaptarComentario(
    comentario,
    comentariosPorId,
    usuarioAtual,
    cargosPorComentarioId,
    cargosPorAutorId,
) {
    const id = idComentario(comentario);
    const autorId = autorIdComentario(comentario);
    const parentId = parentIdComentario(comentario);
    const comentarioPai =
        pegarObjeto(comentario, [
            'parent',
            'comentario_pai',
            'comentarioPai',
            'comentario_parent',
            'comentarioParent',
            'resposta',
            'resposta_para',
            'respostaPara',
            'comentario_respondido',
            'comentarioRespondido',
        ]) || (parentId ? comentariosPorId.get(String(parentId)) : null);
    const autor = autorComentario(comentario);
    const criadoEm = pegar(comentario, ['criado_em', 'created_at', 'data_criacao']);
    const { data, horario } = formatarDataHora(criadoEm);
    const tipoId = Number(
        pegar(comentario, ['comentario_tipo_id', 'tipo_comentario_id', 'tipoId'], 1),
    );
    const registroReferenciaId = pegar(
        comentario,
        ['registro_referencia_id', 'registroReferenciaId', 'registro_referencia', 'registro_id'],
        null,
    );
    const registro = pegarObjeto(comentario, ['registro']);
    const cargo =
        autor.cargo ||
        cargosPorComentarioId.get(String(id)) ||
        cargosPorAutorId.get(String(autorId)) ||
        (String(autorId) === String(usuarioAtual?.id) ? usuarioAtual?.cargo : '') ||
        (tipoId === 3 ? 'Registro' : '');
    const tituloRegistro = textoDoValor(
        pegar(
            registro,
            ['registro_titulo', 'titulo', 'nome'],
            pegar(
                comentario,
                ['registro_titulo', 'registroTitulo', 'titulo_registro', 'registro_nome'],
                '',
            ),
        ),
    );
    const registroLinkId = pegar(
        registro,
        ['id', 'registro_id', 'registroId'],
        registroReferenciaId,
    );

    return {
        id,
        parentId,
        tipoId,
        registroReferenciaId,
        nome: autor.nome,
        cargo,
        data,
        horario,
        ordem: timestampSeguro(criadoEm),
        texto: textoComentario(comentario),
        avatar: iniciais(autor.nome),
        foto: autor.foto,
        resposta: referenciaComentario(comentarioPai) || referenciaRespostaDireta(comentario),
        referencia:
            tipoId === 3 || registroReferenciaId || registro?.registro_id
                ? {
                      autor: 'Sugestão de Requisito',
                      cargo: tituloRegistro || 'Registro apagado',
                      texto: '',
                      registroId: registroLinkId || null,
                      registroApagado: !tituloRegistro,
                      href: registroLinkId && tituloRegistro ? `/registro/${registroLinkId}` : null,
                  }
                : null,
    };
}

function prepararComentarios(comentariosApi, usuarioAtual) {
    const comentarios = Array.isArray(comentariosApi) ? comentariosApi : [];
    const comentariosPorId = new Map(
        comentarios.map((comentario) => [String(idComentario(comentario)), comentario]),
    );
    const cargosPorComentarioId = new Map();
    const cargosPorAutorId = new Map();

    comentarios.forEach((comentario) => {
        const parent = pegarObjeto(comentario, ['parent']);
        const parentId = pegar(parent, ['parent_id'], null);
        const parentAutorId = pegar(parent, ['parent_autor_id'], null);
        const parentCargo = textoDoValor(
            pegar(parent, ['parent_autor_nivel_acesso', 'parent_cargo', 'cargo'], ''),
        );

        if (parentId && parentCargo) {
            cargosPorComentarioId.set(String(parentId), parentCargo);
        }

        if (parentAutorId && parentCargo) {
            cargosPorAutorId.set(String(parentAutorId), parentCargo);
        }
    });

    return ordenarComentarios(
        comentarios.map((comentario) =>
            adaptarComentario(
                comentario,
                comentariosPorId,
                usuarioAtual,
                cargosPorComentarioId,
                cargosPorAutorId,
            ),
        ),
    );
}

async function prepararComentariosComRegistros(comentariosApi, usuarioAtual) {
    const comentarios = prepararComentarios(comentariosApi, usuarioAtual);
    const registrosIds = [
        ...new Set(
            comentarios
                .map((comentario) => comentario.referencia?.registroId)
                .filter(Boolean)
                .map(String),
        ),
    ];

    if (registrosIds.length === 0) {
        return comentarios;
    }

    const registros = await Promise.all(
        registrosIds.map(async (registroId) => {
            try {
                const registro = await getRegisterById(registroId);
                const titulo = textoDoValor(
                    pegar(registro, ['titulo', 'nome', 'registro_titulo'], ''),
                );

                return [registroId, { apagado: false, titulo }];
            } catch (error) {
                if (error.status === 404) {
                    return [registroId, { apagado: true, titulo: '' }];
                }

                return [registroId, null];
            }
        }),
    );
    const registrosPorId = new Map(registros);

    return comentarios.map((comentario) => {
        const referencia = comentario.referencia;

        if (!referencia?.registroId) {
            return comentario;
        }

        const registro = registrosPorId.get(String(referencia.registroId));

        if (!registro) {
            return comentario;
        }

        if (registro.apagado) {
            return {
                ...comentario,
                referencia: {
                    ...referencia,
                    cargo: 'Registro apagado',
                    href: null,
                    registroApagado: true,
                },
            };
        }

        const titulo = registro.titulo || referencia.cargo || 'Registro';

        return {
            ...comentario,
            referencia: {
                ...referencia,
                cargo: titulo,
                href: `/registro/${referencia.registroId}`,
                registroApagado: false,
            },
        };
    });
}

function Avatar({ comentario, className = '' }) {
    return (
        <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-base)] bg-[var(--cinza-200)] ${className}`}
        >
            {comentario.foto ? (
                <img src={comentario.foto} alt="" className="h-full w-full object-cover" />
            ) : (
                <ParagraphMedium as="span" className="font-semibold text-[var(--color-base)]">
                    {comentario.avatar}
                </ParagraphMedium>
            )}
        </div>
    );
}

function ReferenciaComentario({ referencia }) {
    const conteudo = (
        <>
            <div className="mb-1 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 text-[15px]">
                <ParagraphMedium
                    as="span"
                    className="break-words text-[var(--color-base)] [overflow-wrap:anywhere]"
                >
                    {referencia.autor}
                </ParagraphMedium>
                {referencia.cargo && (
                    <ParagraphMedium
                        as="span"
                        className="break-words text-[var(--cinza-400)] [overflow-wrap:anywhere]"
                    >
                        {referencia.cargo}
                    </ParagraphMedium>
                )}
            </div>
            {referencia.texto && (
                <ParagraphMedium className="line-clamp-3 whitespace-pre-wrap break-words leading-5 text-[var(--cinza-700)] [overflow-wrap:anywhere]">
                    {referencia.texto}
                </ParagraphMedium>
            )}
        </>
    );
    const className =
        'mb-2 block max-w-full overflow-hidden rounded-md bg-[var(--cinza-200)] px-4 py-2';

    if (referencia.href) {
        return (
            <Link
                to={referencia.href}
                className={`${className} transition-colors hover:bg-[var(--roxo-light)]`}
            >
                {conteudo}
            </Link>
        );
    }

    return <div className={className}>{conteudo}</div>;
}

function ComentarioCard({ comentario, mobile = false, onResponder }) {
    const referencia = comentario.resposta || comentario.referencia;
    const textoNome = mobile ? 'text-[16px]' : 'text-[20px]';
    const textoCargo = mobile ? 'text-[15px]' : 'text-[18px]';
    const classeAcoes = mobile
        ? 'mt-2 flex h-8 justify-end'
        : 'pointer-events-none mt-1 flex h-8 justify-end opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100';

    return (
        <article className="group flex w-full min-w-0 items-start gap-3">
            <Avatar comentario={comentario} className={mobile ? 'h-12 w-12' : 'h-16 w-16'} />

            <div className="min-w-0 flex-1 overflow-hidden">
                <div className="mb-1 flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                        <ParagraphLarge
                            as="span"
                            className={`${textoNome} min-w-0 break-words font-semibold text-[var(--color-base)] [overflow-wrap:anywhere]`}
                        >
                            {comentario.nome}
                        </ParagraphLarge>
                        {comentario.cargo && (
                            <ParagraphLarge
                                as="span"
                                className={`${textoCargo} min-w-0 break-words font-semibold text-[var(--cinza-400)] [overflow-wrap:anywhere]`}
                            >
                                {comentario.cargo}
                            </ParagraphLarge>
                        )}
                    </div>
                    {(comentario.horario || comentario.data) && (
                        <ParagraphMedium
                            as="span"
                            className={`shrink-0 text-[var(--cinza-400)] ${
                                mobile ? 'text-[12px]' : 'text-[18px]'
                            }`}
                        >
                            {comentario.horario} · {comentario.data}
                        </ParagraphMedium>
                    )}
                </div>

                <div className="max-w-full overflow-hidden rounded-[18px] border border-[var(--cinza-500)] px-4 py-3 text-black">
                    {referencia && <ReferenciaComentario referencia={referencia} />}

                    <ParagraphLarge className="whitespace-pre-wrap break-words leading-6 [overflow-wrap:anywhere]">
                        {limparMarkdownTexto(comentario.texto)}
                    </ParagraphLarge>
                </div>

                <div className={classeAcoes}>
                    <button
                        type="button"
                        onClick={() => onResponder(comentario)}
                        className="rounded border border-[var(--cinza-500)] px-3 py-1 text-[var(--cinza-700)]"
                    >
                        <ParagraphMedium as="span">Responder</ParagraphMedium>
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
                <div className="flex items-center justify-between rounded bg-[var(--cinza-200)] px-3 py-2 text-[var(--cinza-700)]">
                    <ParagraphSmall as="span" className="truncate">
                        Respondendo {respostaPara.nome}: {respostaPara.texto}
                    </ParagraphSmall>
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
                    <ParagraphSmall as="span" className="sr-only">
                        Escreva seu comentário
                    </ParagraphSmall>
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
            <ParagraphMedium className="text-[var(--cinza-500)]">
                Carregando comentários...
            </ParagraphMedium>
        );
    }

    if (comentarios.length === 0) {
        return (
            <ParagraphMedium className="text-[var(--cinza-500)]">
                Nenhum comentário encontrado.
            </ParagraphMedium>
        );
    }

    return (
        <div className={`flex flex-col-reverse ${mobile ? 'gap-5' : 'gap-8'}`}>
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
    const usuarioAtual = useMemo(() => lerUsuarioAtual(), []);

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
            const comentariosPreparados = await prepararComentariosComRegistros(
                comentariosApi,
                usuarioAtual,
            );

            setComentarios(comentariosPreparados);
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
                const comentariosPreparados = await prepararComentariosComRegistros(
                    comentariosApi,
                    usuarioAtual,
                );

                if (ativo) {
                    setComentarios(comentariosPreparados);
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
    }, [documentoId, onErro, usuarioAtual]);

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
                        <Title2 className="text-[26px] text-[var(--cinza-700)]">Comentários</Title2>
                        <button type="button" onClick={onFechar} aria-label="Fechar comentários">
                            <X className="text-[var(--cinza-700)]" size={26} />
                        </button>
                    </div>
                    <div className="mt-2 border-b border-[var(--cinza-700)]" />
                    {erro && (
                        <ParagraphSmall className="mt-2 text-[var(--color-alert)]">
                            {erro}
                        </ParagraphSmall>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-8">
                    <ListaComentarios
                        comentarios={comentarios}
                        carregando={carregando}
                        onResponder={setRespostaPara}
                    />
                </div>

                <footer className="border-t border-[var(--cinza-700)] px-4 py-3">
                    {campoComentario}
                </footer>
            </aside>

            <section className="fixed inset-0 z-[1001] flex flex-col bg-white lg:hidden">
                <MobileHeader />

                <div className="flex min-h-[58px] items-center gap-1 border-b border-[var(--cinza-200)] px-5 py-3">
                    <button
                        type="button"
                        onClick={onFechar}
                        className="text-[var(--cinza-700)]"
                        aria-label="Voltar"
                    >
                        <ChevronsLeft size={30} strokeWidth={3} />
                    </button>
                    <Title2 className="text-[26px] text-[var(--cinza-700)]">Comentários</Title2>
                </div>

                {erro && (
                    <ParagraphSmall className="px-4 pb-2 text-[var(--color-alert)]">
                        {erro}
                    </ParagraphSmall>
                )}

                <div className="flex-1 overflow-y-auto px-4 pb-6">
                    <ListaComentarios
                        comentarios={comentarios}
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
