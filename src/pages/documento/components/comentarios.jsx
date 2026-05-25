import { useEffect, useMemo, useState } from 'react';
import { ChevronsLeft, Menu, Send, X } from 'lucide-react';
import logotipoMobile from '../../../assets/logotipo-mobile.svg';
import { createDocumentComment, getDocumentComments } from '../../../services/api';

const META_KEY = 'documentCommentMeta';

function valor(objeto, campos, fallback = '') {
    for (const campo of campos) {
        const valorCampo = objeto?.[campo];

        if (valorCampo !== undefined && valorCampo !== null && valorCampo !== '') {
            return valorCampo;
        }
    }

    return fallback;
}

function objeto(objetoBase, campos) {
    const valorCampo = valor(objetoBase, campos, null);

    return valorCampo && typeof valorCampo === 'object' && !Array.isArray(valorCampo)
        ? valorCampo
        : null;
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
            id: valor(usuario, ['id', 'usuario_id', 'usuarioId', 'user_id'], null),
            nome: valor(usuario, ['nome', 'name', 'email'], 'Usuário'),
            cargo: valor(
                usuario,
                ['cargo', 'perfil', 'papel', 'funcao', 'tipo_usuario', 'tipoUsuario', 'role'],
                '',
            ),
            foto: valor(usuario, ['foto_perfil', 'foto', 'avatar'], ''),
        };
    } catch {
        return { id: null, nome: 'Usuário', cargo: '', foto: '' };
    }
}

function autorDoComentario(comentario, fallback = 'Usuário') {
    const usuario = objeto(comentario, [
        'usuario',
        'user',
        'criador',
        'autor',
        'created_by',
        'createdBy',
    ]);
    const autorDireto = valor(
        comentario,
        [
            'nome_criador',
            'criador_nome',
            'nome_usuario',
            'usuario_nome',
            'autor_nome',
            'nome_autor',
            'nome',
            'name',
        ],
        '',
    );
    const nome = typeof autorDireto === 'object' ? '' : autorDireto;

    return {
        nome: nome || valor(usuario, ['nome', 'name', 'email'], fallback),
        cargo:
            valor(
                comentario,
                ['cargo', 'perfil', 'papel', 'funcao', 'tipo_usuario', 'tipoUsuario', 'role'],
                '',
            ) ||
            valor(
                usuario,
                ['cargo', 'perfil', 'papel', 'funcao', 'tipo_usuario', 'tipoUsuario', 'role'],
                '',
            ),
        foto:
            valor(comentario, ['foto_perfil', 'foto', 'avatar'], '') ||
            valor(usuario, ['foto_perfil', 'foto', 'avatar'], ''),
    };
}

function textoDoComentario(comentario) {
    return valor(comentario, ['conteudo', 'texto', 'comentario', 'mensagem'], '');
}

function idDoComentario(comentario) {
    return valor(comentario, ['id', 'comentario_id', 'comentarioId'], null);
}

function parentIdDoComentario(comentario) {
    const parent = valor(
        comentario,
        [
            'parent_id',
            'parentId',
            'comentario_pai_id',
            'comentarioPaiId',
            'resposta_para_id',
            'respostaParaId',
        ],
        null,
    );

    return parent && typeof parent === 'object' ? idDoComentario(parent) : parent;
}

function referenciaDoComentario(comentario) {
    if (!comentario) {
        return null;
    }

    const texto = textoDoComentario(comentario);

    if (!texto) {
        return null;
    }

    const autor = autorDoComentario(comentario, 'Comentário');

    return {
        autor: autor.nome,
        cargo: autor.cargo,
        texto,
    };
}

function referenciaCamposPlanos(comentario) {
    const textoCampo = valor(
        comentario,
        [
            'parent_conteudo',
            'parent_texto',
            'comentario_pai_conteudo',
            'comentario_pai_texto',
            'comentario_respondido',
            'comentarioRespondido',
            'conteudo_comentario_pai',
            'texto_comentario_pai',
            'conteudo_comentario_respondido',
            'texto_comentario_respondido',
            'resposta_conteudo',
            'resposta_texto',
            'conteudo_resposta',
            'texto_resposta',
            'mensagem_respondida',
        ],
        '',
    );
    const texto =
        textoCampo && typeof textoCampo === 'object' ? textoDoComentario(textoCampo) : textoCampo;

    if (!texto) {
        return null;
    }

    return {
        autor: valor(
            comentario,
            [
                'parent_nome',
                'parent_nome_criador',
                'comentario_pai_nome',
                'nome_comentario_pai',
                'resposta_nome',
                'nome_resposta',
                'nome_comentario_respondido',
            ],
            'Comentário',
        ),
        cargo: valor(
            comentario,
            [
                'parent_cargo',
                'comentario_pai_cargo',
                'cargo_comentario_pai',
                'resposta_cargo',
                'cargo_resposta',
                'cargo_comentario_respondido',
                'tipo_usuario_comentario_respondido',
                'tipoUsuarioComentarioRespondido',
            ],
            '',
        ),
        texto,
    };
}

function referenciaResposta(comentario) {
    if (!comentario?.texto) {
        return null;
    }

    return {
        autor: comentario.nome,
        cargo: comentario.cargo,
        texto: comentario.texto,
    };
}

function lerMeta(documentoId) {
    try {
        const dados = JSON.parse(localStorage.getItem(META_KEY) || '{}');

        return dados[String(documentoId)] || {};
    } catch {
        return {};
    }
}

function salvarMeta(documentoId, comentarioId, dadosComentario) {
    if (!documentoId || comentarioId === null || comentarioId === undefined || !dadosComentario) {
        return;
    }

    try {
        const dados = JSON.parse(localStorage.getItem(META_KEY) || '{}');
        const documentoKey = String(documentoId);

        dados[documentoKey] = {
            ...(dados[documentoKey] || {}),
            [String(comentarioId)]: {
                ...(dados[documentoKey]?.[String(comentarioId)] || {}),
                ...dadosComentario,
            },
        };

        localStorage.setItem(META_KEY, JSON.stringify(dados));
    } catch {
        return;
    }
}

function aplicarMeta(comentarios, documentoId) {
    const meta = lerMeta(documentoId);

    return comentarios.map((comentario) => {
        const dados = meta[String(comentario.id)];

        if (!dados) {
            return comentario;
        }

        const autor = dados.autor || {};
        const resposta = dados.resposta?.texto ? dados.resposta : comentario.resposta;
        const nome = autor.nome || comentario.nome;

        return {
            ...comentario,
            nome,
            cargo: autor.cargo || comentario.cargo,
            foto: autor.foto || comentario.foto,
            avatar: iniciais(nome),
            resposta,
        };
    });
}

function adaptarComentario(comentario, comentariosPorId) {
    const id = idDoComentario(comentario);
    const parentId = parentIdDoComentario(comentario);
    const parentInline = objeto(comentario, [
        'parent',
        'comentario_pai',
        'comentarioPai',
        'resposta',
        'resposta_para',
        'respostaPara',
        'comentario_respondido',
        'comentarioRespondido',
    ]);
    const parent = parentInline || (parentId ? comentariosPorId.get(String(parentId)) : null);
    const autor = autorDoComentario(comentario);
    const criadoEm = valor(comentario, ['criado_em', 'created_at', 'data_criacao']);
    const { data, horario } = formatarDataHora(criadoEm);
    const registroReferenciaId = valor(
        comentario,
        ['registro_referencia_id', 'registroReferenciaId'],
        null,
    );
    const tipoId = Number(
        valor(comentario, ['comentario_tipo_id', 'tipo_comentario_id', 'tipoId'], 1),
    );

    return {
        id,
        parentId,
        registroReferenciaId,
        tipoId,
        nome: autor.nome,
        cargo: autor.cargo || (tipoId === 3 ? 'Registro' : ''),
        data,
        horario,
        texto: textoDoComentario(comentario),
        avatar: iniciais(autor.nome),
        foto: autor.foto,
        resposta: referenciaDoComentario(parent) || referenciaCamposPlanos(comentario),
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

function prepararComentarios(comentariosApi, documentoId) {
    const comentarios = Array.isArray(comentariosApi) ? comentariosApi : [];
    const comentariosPorId = new Map(
        comentarios.map((comentario) => [String(idDoComentario(comentario)), comentario]),
    );
    const comentariosAdaptados = comentarios.map((comentario) =>
        adaptarComentario(comentario, comentariosPorId),
    );

    return aplicarMeta(comentariosAdaptados, documentoId);
}

function comentarioCriadoDaApi(respostaApi) {
    if (!respostaApi || Array.isArray(respostaApi) || typeof respostaApi !== 'object') {
        return null;
    }

    return respostaApi.comentario || respostaApi.data || respostaApi;
}

function acharComentarioCriado(comentarios, comentarioRecente) {
    if (!comentarioRecente) {
        return null;
    }

    if (comentarioRecente.id !== null && comentarioRecente.id !== undefined) {
        const encontradoPorId = comentarios.find(
            (comentario) => String(comentario.id) === String(comentarioRecente.id),
        );

        if (encontradoPorId) {
            return encontradoPorId;
        }
    }

    for (let i = comentarios.length - 1; i >= 0; i -= 1) {
        if (String(comentarios[i].texto || '').trim() === comentarioRecente.texto) {
            return comentarios[i];
        }
    }

    return null;
}

function aplicarComentarioRecente(comentarios, comentarioRecente) {
    const criado = acharComentarioCriado(comentarios, comentarioRecente);

    if (!criado) {
        return comentarios;
    }

    return comentarios.map((comentario) => {
        if (comentario.id !== criado.id) {
            return comentario;
        }

        return {
            ...comentario,
            nome: comentarioRecente.autor.nome,
            cargo: comentarioRecente.autor.cargo,
            foto: comentarioRecente.autor.foto,
            avatar: iniciais(comentarioRecente.autor.nome),
            resposta: referenciaResposta(comentarioRecente.respostaPara) || comentario.resposta,
        };
    });
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
    const textoCabecalho = mobile ? 'text-[16px]' : 'text-[20px]';
    const textoCargo = mobile ? 'text-[15px]' : 'text-[18px]';
    const estiloAcao = mobile
        ? 'mt-2 flex h-8 justify-end'
        : 'pointer-events-none mt-1 flex h-8 justify-end opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100';

    return (
        <article className="group flex w-full min-w-0 items-start gap-3">
            <Avatar comentario={comentario} className={mobile ? 'h-12 w-12' : 'h-16 w-16'} />

            <div className="min-w-0 flex-1 overflow-hidden">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-1 font-inter">
                    <span
                        className={`${textoCabecalho} min-w-0 break-words font-semibold text-[var(--color-base)] [overflow-wrap:anywhere]`}
                    >
                        {comentario.nome}
                    </span>
                    {comentario.cargo && (
                        <span
                            className={`${textoCargo} truncate font-semibold text-[var(--cinza-400)]`}
                        >
                            {comentario.cargo}
                        </span>
                    )}
                    {mobile && (
                        <span className="ml-auto shrink-0 text-[12px] text-[var(--cinza-400)]">
                            {comentario.horario} · {comentario.data}
                        </span>
                    )}
                </div>

                <div className="max-w-full overflow-hidden rounded-[18px] border border-[var(--cinza-500)] px-4 py-3 font-inter text-[16px] leading-6 text-black">
                    {referencia && (
                        <div className="mb-2 max-w-full overflow-hidden rounded-md bg-[var(--cinza-200)] px-4 py-2">
                            <div className="mb-1 break-words text-[15px] text-[var(--color-base)] [overflow-wrap:anywhere]">
                                {referencia.autor}{' '}
                                {referencia.cargo && (
                                    <span className="text-[var(--cinza-400)]">
                                        {referencia.cargo}
                                    </span>
                                )}
                            </div>
                            {referencia.texto && (
                                <p className="line-clamp-3 whitespace-pre-wrap break-words text-[14px] leading-5 text-[var(--cinza-700)] [overflow-wrap:anywhere]">
                                    {referencia.texto}
                                </p>
                            )}
                        </div>
                    )}

                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                        {comentario.texto}
                    </p>

                    {!mobile && (
                        <div className="mt-1 text-right text-[14px] text-[var(--cinza-500)]">
                            {comentario.horario} · {comentario.data}
                        </div>
                    )}
                </div>

                <div className={estiloAcao}>
                    <button
                        type="button"
                        onClick={() => onResponder(comentario)}
                        className="rounded border border-[var(--cinza-500)] px-3 py-1 font-inter text-[14px] text-[var(--cinza-700)]"
                    >
                        Responder
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
    const usuarioAtual = useMemo(() => lerUsuarioAtual(), []);

    async function carregarComentarios(comentarioRecente = null) {
        if (!documentoId) {
            setErro('Informe o ID do documento para carregar comentários.');
            setCarregando(false);
            return;
        }

        try {
            setCarregando(true);
            setErro('');
            const comentariosApi = await getDocumentComments(documentoId);
            let novosComentarios = prepararComentarios(comentariosApi, documentoId);

            if (comentarioRecente) {
                novosComentarios = aplicarComentarioRecente(novosComentarios, comentarioRecente);
                const criado = acharComentarioCriado(novosComentarios, comentarioRecente);

                salvarMeta(documentoId, criado?.id, {
                    autor: comentarioRecente.autor,
                    resposta: referenciaResposta(comentarioRecente.respostaPara),
                });
            }

            setComentarios(novosComentarios);
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
                    setComentarios(prepararComentarios(comentariosApi, documentoId));
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

            const conteudo = texto.trim();
            const autor = {
                id: usuarioAtual.id,
                nome: usuarioAtual.nome,
                cargo: usuarioAtual.cargo,
                foto: usuarioAtual.foto,
            };
            const comentarioCriado = await createDocumentComment({
                documento_id: documentoId,
                conteudo,
                parent_id: respostaPara?.id || null,
                registro_referencia_id: null,
                comentario_tipo_id: respostaPara ? 2 : 1,
                nome_criador: autor.nome,
                usuario_id: autor.id,
                cargo: autor.cargo,
                tipo_usuario: autor.cargo,
                foto_perfil: autor.foto,
            });
            const comentarioApi = comentarioCriadoDaApi(comentarioCriado);
            const comentarioRecente = {
                id: idDoComentario(comentarioApi),
                texto: conteudo,
                autor,
                respostaPara,
            };

            salvarMeta(documentoId, comentarioRecente.id, {
                autor,
                resposta: referenciaResposta(respostaPara),
            });

            setTexto('');
            setRespostaPara(null);
            await carregarComentarios(comentarioRecente);
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
                    {erro && (
                        <p className="mt-2 font-inter text-[12px] text-[var(--color-alert)]">
                            {erro}
                        </p>
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
