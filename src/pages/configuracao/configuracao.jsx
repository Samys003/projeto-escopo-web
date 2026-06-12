import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, LogOut, Minus, PenLine, Plus, RotateCcw, X } from 'lucide-react';
import MobileHeader from '../../components/MobileHeader.jsx';
import DesktopSidebar from '../../components/DesktopSidebar.jsx';
import Planos from './components/planos.jsx';
import { plans } from './components/planos-data.js';
import FeedbackMessage from '../../components/FeedbackMessage.jsx';
import {
    updateUserName,
    updateUserProfilePicture,
    deleteUserAccount,
    updatePassword,
    getUserByEmail,
    getApiErrorMessage,
} from '../../services/api.js';
import {
    carregarUsuarioAutenticadoAtualizado,
    dadosUsuarioResposta,
    extrairFotoPerfil,
    lerUsuarioAutenticado,
    normalizarFotoPerfil,
    salvarUsuarioAutenticado,
} from '../../utils/user-profile.js';
import Title2 from '../../components/Typography/Title2.jsx';
import ParagraphMedium from '../../components/Typography/ParagraphMedium.jsx';

const ZOOM_MINIMO = 1;
const ZOOM_MAXIMO = 3;
const TAMANHO_FOTO_SAIDA = 512;
const TIPOS_FOTO_PERMITIDOS = ['image/jpeg', 'image/png'];

function getCurrentPlan(usuario) {
    const planoAtual = usuario?.plano_atual;

    if (typeof planoAtual === 'object' && planoAtual !== null) {
        const planName = planoAtual.nome || planoAtual.name;
        return (
            plans.find((plan) => plan.name.toLowerCase() === planName?.toLowerCase()) || plans[0]
        );
    }

    if (typeof planoAtual === 'number') {
        return plans[planoAtual] || plans[0];
    }

    if (typeof planoAtual === 'string') {
        const planByName = plans.find(
            (plan) => plan.name.toLowerCase() === planoAtual.toLowerCase(),
        );
        const planByIndex = plans[Number(planoAtual)];
        return planByName || planByIndex || plans[0];
    }

    return plans[0];
}

function limitarValor(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

function calcularDimensoesCorte(foto, zoom, tamanho) {
    if (!foto?.largura || !foto?.altura || !tamanho) {
        return {
            escala: 1,
            larguraRenderizada: tamanho || 0,
            alturaRenderizada: tamanho || 0,
        };
    }

    const zoomSeguro = limitarValor(Number(zoom) || ZOOM_MINIMO, ZOOM_MINIMO, ZOOM_MAXIMO);
    const escalaBase = tamanho / Math.min(foto.largura, foto.altura);
    const escala = escalaBase * zoomSeguro;

    return {
        escala,
        larguraRenderizada: foto.largura * escala,
        alturaRenderizada: foto.altura * escala,
    };
}

function calcularLimitesCorte(foto, zoom, tamanho) {
    const { larguraRenderizada, alturaRenderizada } = calcularDimensoesCorte(foto, zoom, tamanho);

    return {
        x: Math.max((larguraRenderizada - tamanho) / 2, 0),
        y: Math.max((alturaRenderizada - tamanho) / 2, 0),
    };
}

function ajustarCorte(corte, foto, tamanho) {
    const zoom = limitarValor(Number(corte.zoom) || ZOOM_MINIMO, ZOOM_MINIMO, ZOOM_MAXIMO);
    const limites = calcularLimitesCorte(foto, zoom, tamanho);

    return {
        zoom,
        offsetX: limitarValor(Number(corte.offsetX) || 0, -limites.x, limites.x),
        offsetY: limitarValor(Number(corte.offsetY) || 0, -limites.y, limites.y),
    };
}

function carregarImagem(src) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();
        imagem.onload = () => resolve(imagem);
        imagem.onerror = () => reject(new Error('Erro ao carregar imagem.'));
        imagem.src = src;
    });
}

function normalizarTipoFoto(tipo) {
    if (tipo === 'image/jpg') {
        return 'image/jpeg';
    }

    return TIPOS_FOTO_PERMITIDOS.includes(tipo) ? tipo : 'image/png';
}

function trocarTipoDataUrl(dataUrl, tipo) {
    const partes = String(dataUrl || '').split(',');

    if (partes.length < 2) {
        return dataUrl;
    }

    return `data:${tipo};base64,${partes.slice(1).join(',')}`;
}

async function gerarFotoCortada(foto, corte, tamanho, tipo = 'image/png') {
    const imagem = await carregarImagem(foto.src);
    const corteAjustado = ajustarCorte(corte, foto, tamanho);
    const { escala, larguraRenderizada, alturaRenderizada } = calcularDimensoesCorte(
        foto,
        corteAjustado.zoom,
        tamanho,
    );
    const larguraFonte = tamanho / escala;
    const alturaFonte = tamanho / escala;
    const origemX = limitarValor(
        (larguraRenderizada / 2 - tamanho / 2 - corteAjustado.offsetX) / escala,
        0,
        Math.max(foto.largura - larguraFonte, 0),
    );
    const origemY = limitarValor(
        (alturaRenderizada / 2 - tamanho / 2 - corteAjustado.offsetY) / escala,
        0,
        Math.max(foto.altura - alturaFonte, 0),
    );
    const canvas = document.createElement('canvas');
    const contexto = canvas.getContext('2d');

    if (!contexto) {
        throw new Error('Não foi possível preparar o corte da imagem.');
    }

    canvas.width = TAMANHO_FOTO_SAIDA;
    canvas.height = TAMANHO_FOTO_SAIDA;
    contexto.fillStyle = '#ffffff';
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.drawImage(
        imagem,
        origemX,
        origemY,
        larguraFonte,
        alturaFonte,
        0,
        0,
        canvas.width,
        canvas.height,
    );

    const tipoSaida = normalizarTipoFoto(tipo);

    if (tipoSaida === 'image/jpeg') {
        return canvas.toDataURL(tipoSaida, 0.9);
    }

    return canvas.toDataURL(tipoSaida);
}

async function salvarFotoPerfilCortada(foto, corte, tamanho) {
    const tipoOriginal = normalizarTipoFoto(foto.tipo);
    const tipos = [...new Set([tipoOriginal, 'image/png', 'image/jpeg'])];
    let ultimoErro = null;

    for (const tipo of tipos) {
        const base64String = await gerarFotoCortada(foto, corte, tamanho, tipo);
        const variacoes =
            tipo === 'image/jpeg'
                ? [
                      base64String,
                      trocarTipoDataUrl(base64String, 'image/jpg'),
                      base64String.split(',')[1],
                  ]
                : [base64String, base64String.split(',')[1]];

        for (const fotoPerfil of variacoes.filter(Boolean)) {
            try {
                const resposta = await updateUserProfilePicture({ foto_perfil: fotoPerfil });

                return {
                    resposta,
                    fotoPerfilSalva: fotoPerfil.includes(',')
                        ? fotoPerfil
                        : `data:${tipo};base64,${fotoPerfil}`,
                };
            } catch (error) {
                ultimoErro = error;

                if (![400, 422].includes(error.status)) {
                    throw error;
                }
            }
        }
    }

    throw ultimoErro || new Error('Erro ao atualizar foto de perfil.');
}

function Configuracao() {
    const navigate = useNavigate();
    const areaCorteRef = useRef(null);
    const arrasteCorteRef = useRef(null);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fotoPreview, setFotoPreview] = useState(null);
    const [fotoParaCortar, setFotoParaCortar] = useState(null);
    const [corteFoto, setCorteFoto] = useState({ zoom: ZOOM_MINIMO, offsetX: 0, offsetY: 0 });
    const [tamanhoAreaCorte, setTamanhoAreaCorte] = useState(280);
    const [editingNome, setEditingNome] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [nomeTemp, setNomeTemp] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    const [senhaNovaConfirm, setSenhaNovaConfirm] = useState('');
    const [showPlanos, setShowPlanos] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteEmail, setDeleteEmail] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const currentPlan = useMemo(() => getCurrentPlan(usuario), [usuario]);
    const popupAberto = showPlanos || showDeleteConfirm || Boolean(fotoParaCortar);
    const dimensoesFotoCorte = useMemo(
        () =>
            fotoParaCortar
                ? calcularDimensoesCorte(fotoParaCortar, corteFoto.zoom, tamanhoAreaCorte)
                : null,
        [fotoParaCortar, corteFoto.zoom, tamanhoAreaCorte],
    );
    const limitesCorte = useMemo(
        () =>
            fotoParaCortar
                ? calcularLimitesCorte(fotoParaCortar, corteFoto.zoom, tamanhoAreaCorte)
                : { x: 0, y: 0 },
        [fotoParaCortar, corteFoto.zoom, tamanhoAreaCorte],
    );

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const usuarioArmazenado = localStorage.getItem('authUser');
                if (usuarioArmazenado) {
                    const aplicarUsuario = (user) => {
                        setUsuario(user);
                        setNomeTemp(user.nome || '');
                        setFotoPreview(
                            normalizarFotoPerfil(
                                user.foto_perfil || user.fotoPerfil || user.foto || user.avatar,
                            ) || null,
                        );
                    };
                    const usuarioLocal = lerUsuarioAutenticado();

                    aplicarUsuario(usuarioLocal);
                    aplicarUsuario(await carregarUsuarioAutenticadoAtualizado());
                } else {
                    setError(
                        'Não foi possível carregar os dados do usuário. Faça login novamente.',
                    );
                }
            } catch {
                setError('Erro ao carregar dados do usuário');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    useEffect(() => {
        if (!popupAberto) {
            return undefined;
        }

        const overflowOriginal = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowOriginal;
        };
    }, [popupAberto]);

    useEffect(() => {
        if (!fotoParaCortar) {
            return undefined;
        }

        function atualizarTamanhoAreaCorte() {
            const largura = areaCorteRef.current?.clientWidth;

            if (largura) {
                setTamanhoAreaCorte(Math.round(largura));
            }
        }

        atualizarTamanhoAreaCorte();
        window.addEventListener('resize', atualizarTamanhoAreaCorte);

        const observer =
            window.ResizeObserver && areaCorteRef.current
                ? new window.ResizeObserver(atualizarTamanhoAreaCorte)
                : null;

        observer?.observe(areaCorteRef.current);

        return () => {
            window.removeEventListener('resize', atualizarTamanhoAreaCorte);
            observer?.disconnect();
        };
    }, [fotoParaCortar]);

    const handleNomeSave = async () => {
        const nomeTratado = nomeTemp.trim();

        if (!nomeTratado) {
            setError('Nome não pode ser vazio');
            return;
        }

        if (nomeTratado.length < 2) {
            setError('Informe um nome válido.');
            return;
        }

        if (nomeTratado.length > 150) {
            setError('O nome deve ter no máximo 150 caracteres.');
            return;
        }

        if (nomeTratado === usuario?.nome) {
            setEditingNome(false);
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            await updateUserName({ nome: nomeTratado });

            const usuarioAtualizado = { ...usuario, nome: nomeTratado };
            setUsuario(usuarioAtualizado);
            salvarUsuarioAutenticado(usuarioAtualizado);

            setEditingNome(false);
            setSuccess('Nome atualizado com sucesso!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Erro ao atualizar nome.'));
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSave = async () => {
        if (!senhaAtual.trim()) {
            setError('Senha atual é obrigatória');
            return;
        }

        if (!senhaNova.trim()) {
            setError('Nova senha é obrigatória');
            return;
        }

        if (senhaNova.length < 8) {
            setError('A nova senha deve ter no mínimo 8 caracteres');
            return;
        }

        if (senhaNova !== senhaNovaConfirm) {
            setError('As senhas não coincidem');
            return;
        }

        if (senhaAtual === senhaNova) {
            setError('A nova senha deve ser diferente da senha atual');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            await updatePassword({ senha_atual: senhaAtual, senha_nova: senhaNova });

            setEditingPassword(false);
            setSenhaAtual('');
            setSenhaNova('');
            setSenhaNovaConfirm('');
            setSuccess('Senha atualizada com sucesso!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Erro ao atualizar senha.'));
        } finally {
            setSaving(false);
        }
    };

    function atualizarCorteFoto(proximoCorte) {
        setCorteFoto((corteAtual) => {
            if (!fotoParaCortar) {
                return corteAtual;
            }

            const atualizacao =
                typeof proximoCorte === 'function' ? proximoCorte(corteAtual) : proximoCorte;
            const corte = { ...corteAtual, ...atualizacao };

            return ajustarCorte(corte, fotoParaCortar, tamanhoAreaCorte);
        });
    }

    function iniciarArrasteCorte(event) {
        if (!fotoParaCortar || saving) {
            return;
        }

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        arrasteCorteRef.current = {
            pointerId: event.pointerId,
            inicioX: event.clientX,
            inicioY: event.clientY,
            offsetX: corteFoto.offsetX,
            offsetY: corteFoto.offsetY,
        };
    }

    function moverArrasteCorte(event) {
        const arraste = arrasteCorteRef.current;

        if (!arraste || arraste.pointerId !== event.pointerId) {
            return;
        }

        atualizarCorteFoto({
            offsetX: arraste.offsetX + event.clientX - arraste.inicioX,
            offsetY: arraste.offsetY + event.clientY - arraste.inicioY,
        });
    }

    function finalizarArrasteCorte(event) {
        const arraste = arrasteCorteRef.current;

        if (!arraste || arraste.pointerId !== event.pointerId) {
            return;
        }

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        arrasteCorteRef.current = null;
    }

    const handleFotoChange = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Selecione uma imagem válida para a foto de perfil.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('A imagem deve ter no máximo 5 MB.');
            return;
        }

        try {
            setError('');
            setSuccess('');

            const reader = new FileReader();

            reader.onload = () => {
                const src = String(reader.result || '');
                const imagem = new Image();

                imagem.onload = () => {
                    setFotoParaCortar({
                        src,
                        nome: file.name,
                        tipo: file.type,
                        largura: imagem.naturalWidth,
                        altura: imagem.naturalHeight,
                    });
                    setCorteFoto({ zoom: ZOOM_MINIMO, offsetX: 0, offsetY: 0 });
                };

                imagem.onerror = () => {
                    setError('Não foi possível carregar esta imagem.');
                };

                imagem.src = src;
            };

            reader.onerror = () => {
                setError('Erro ao processar imagem.');
            };

            reader.readAsDataURL(file);
        } catch {
            setError('Erro ao processar imagem.');
        }
    };

    const handleSalvarFotoCortada = async () => {
        if (!fotoParaCortar || saving) {
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const { resposta, fotoPerfilSalva } = await salvarFotoPerfilCortada(
                fotoParaCortar,
                corteFoto,
                tamanhoAreaCorte,
            );
            const fotoSalva = extrairFotoPerfil(resposta, fotoPerfilSalva);
            const usuarioArmazenado = lerUsuarioAutenticado();

            const usuarioAtualizado = {
                ...usuarioArmazenado,
                ...usuario,
                ...dadosUsuarioResposta(resposta),
                foto_perfil: fotoSalva,
                fotoPerfil: fotoSalva,
            };

            setUsuario(usuarioAtualizado);
            setFotoPreview(fotoSalva);
            salvarUsuarioAutenticado(usuarioAtualizado);
            setFotoParaCortar(null);
            setSuccess('Foto de perfil atualizada com sucesso!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Erro ao atualizar foto de perfil.'));
        } finally {
            setSaving(false);
        }
    };

    const handleCancelarCorteFoto = () => {
        if (saving) {
            return;
        }

        setFotoParaCortar(null);
        setCorteFoto({ zoom: ZOOM_MINIMO, offsetX: 0, offsetY: 0 });
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setDeleteEmail('');
        setDeleteError('');
    };

    const handleDeleteAccount = async () => {
        const emailDigitado = deleteEmail.trim();
        const emailUsuario = usuario?.email || '';

        if (!emailDigitado) {
            setDeleteError('Digite o e-mail de cadastro.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailDigitado)) {
            setDeleteError('Digite um e-mail válido.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setDeleteError('');

            const usuarioEncontrado = await getUserByEmail(emailDigitado);
            const emailEncontrado = usuarioEncontrado?.email || emailDigitado;

            if (emailEncontrado.toLowerCase() !== emailUsuario.toLowerCase()) {
                setDeleteError('O e-mail informado não corresponde ao usuário logado.');
                return;
            }

            await deleteUserAccount();

            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');

            navigate('/');
        } catch (err) {
            setDeleteError(getApiErrorMessage(err, 'Erro ao confirmar e-mail.'));
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        navigate('/');
    };

    const cancelPasswordEdit = () => {
        setEditingPassword(false);
        setSenhaAtual('');
        setSenhaNova('');
        setSenhaNovaConfirm('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--fundo)] lg:flex">
                <div className="lg:hidden">
                    <MobileHeader />
                </div>
                <DesktopSidebar onLogout={handleLogout} />
                <main className="flex flex-1 items-center justify-center px-4 py-12">
                    <ParagraphMedium className="text-[var(--cinza-600)]">
                        Carregando...
                    </ParagraphMedium>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--fundo)] lg:flex">
            <div className="lg:hidden">
                <MobileHeader />
            </div>
            <DesktopSidebar onLogout={handleLogout} />

            <main className="flex-1 px-5 py-8 lg:px-8 lg:py-14 xl:px-20">
                <div className="mx-auto flex w-full max-w-[1240px] flex-col">
                    <FeedbackMessage className="mb-5">{error}</FeedbackMessage>
                    <FeedbackMessage type="success" className="mb-5">
                        {success}
                    </FeedbackMessage>

                    <section className="grid items-start gap-5 lg:grid-cols-[minmax(300px,470px)_minmax(240px,360px)] lg:justify-between lg:gap-8 xl:gap-24">
                        <div className="order-1 flex flex-col items-center lg:order-2 lg:pt-16">
                            <div className="relative">
                                <div className="flex aspect-square w-[clamp(180px,54vw,210px)] items-center justify-center overflow-hidden rounded-full border-[3px] border-[var(--color-base)] bg-[var(--cinza-200)] lg:w-[280px] lg:border-4 xl:w-[330px]">
                                    {fotoPreview ? (
                                        <img
                                            src={fotoPreview}
                                            alt="Foto de perfil"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Title2 className="text-5xl font-semibold text-[var(--cinza-500)]">
                                            {(usuario?.nome || 'U').charAt(0).toUpperCase()}
                                        </Title2>
                                    )}
                                </div>
                                <label
                                    htmlFor="foto-input"
                                    className="absolute bottom-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] lg:bottom-2 lg:right-5 lg:h-[60px] lg:w-[60px]"
                                    aria-label="Alterar foto"
                                >
                                    <Camera className="h-4 w-4 lg:h-6 lg:w-6" />
                                </label>
                                <input
                                    id="foto-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                    disabled={saving}
                                    className="hidden"
                                />
                            </div>

                            <div className="mt-5 hidden w-full max-w-[360px] flex-col items-center lg:flex">
                                {editingNome ? (
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={nomeTemp}
                                            onChange={(e) => setNomeTemp(e.target.value)}
                                            className="w-full rounded-xl border-2 border-[var(--color-base)] bg-white px-4 py-3 text-center text-xl font-semibold text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                            disabled={saving}
                                        />
                                        <div className="mt-3 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={handleNomeSave}
                                                disabled={saving}
                                                className="flex-1 rounded-lg bg-[var(--color-base)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50"
                                            >
                                                {saving ? 'Salvando...' : 'Salvar'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingNome(false);
                                                    setNomeTemp(usuario?.nome || '');
                                                }}
                                                disabled={saving}
                                                className="flex-1 rounded-lg bg-[var(--cinza-200)] px-4 py-2 font-semibold text-[var(--cinza-700)] transition-colors hover:bg-[var(--cinza-300)] disabled:opacity-50"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <Title2 className="break-words text-center text-[var(--cinza-700)]">
                                            {usuario?.nome || 'Usuário'}
                                        </Title2>
                                        <button
                                            type="button"
                                            onClick={() => setEditingNome(true)}
                                            className="shrink-0 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)]"
                                            aria-label="Editar nome"
                                        >
                                            <PenLine className="h-6 w-6" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 flex w-full max-w-[327px] flex-col items-center lg:hidden">
                                {editingNome ? (
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={nomeTemp}
                                            onChange={(e) => setNomeTemp(e.target.value)}
                                            className="w-full rounded-lg border border-[var(--color-base)] bg-white px-3 py-2 text-center text-base font-semibold text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                            disabled={saving}
                                        />
                                        <div className="mt-3 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={handleNomeSave}
                                                disabled={saving}
                                                className="flex-1 rounded-lg bg-[var(--color-base)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50"
                                            >
                                                {saving ? 'Salvando...' : 'Salvar'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingNome(false);
                                                    setNomeTemp(usuario?.nome || '');
                                                }}
                                                disabled={saving}
                                                className="flex-1 rounded-lg bg-[var(--cinza-200)] px-4 py-2 font-semibold text-[var(--cinza-700)] transition-colors hover:bg-[var(--cinza-300)] disabled:opacity-50"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Title2 className="break-words text-center text-2xl leading-tight text-[var(--cinza-700)]">
                                            {usuario?.nome || 'Usuário'}
                                        </Title2>
                                        <button
                                            type="button"
                                            onClick={() => setEditingNome(true)}
                                            className="shrink-0 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)]"
                                            aria-label="Editar nome"
                                        >
                                            <PenLine className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="order-2 mx-auto w-full max-w-[327px] lg:order-1 lg:mx-0 lg:max-w-none lg:pt-24">
                            <div className="space-y-6 lg:space-y-7">
                                <div>
                                    <label htmlFor="email" className="mb-2 block">
                                        <ParagraphMedium className="text-base font-semibold text-[var(--cinza-700)] lg:text-base">
                                            E-mail
                                        </ParagraphMedium>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={usuario?.email || ''}
                                        disabled
                                        className="h-[42px] w-full rounded-lg border border-[var(--cinza-500)] bg-white px-3 text-base text-[var(--cinza-700)] opacity-100 outline-none lg:h-14 lg:rounded-xl lg:border-2 lg:px-5 lg:text-base lg:text-[var(--cinza-500)]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password-display" className="mb-2 block">
                                        <ParagraphMedium className="text-base font-semibold text-[var(--cinza-700)] lg:text-base">
                                            Senha
                                        </ParagraphMedium>
                                    </label>
                                    {editingPassword ? (
                                        <div className="space-y-3">
                                            <input
                                                type="password"
                                                placeholder="Senha atual"
                                                value={senhaAtual}
                                                onChange={(e) => setSenhaAtual(e.target.value)}
                                                disabled={saving}
                                                className="h-[42px] w-full rounded-lg border border-[var(--color-base)] bg-white px-3 text-base text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)] lg:h-14 lg:rounded-xl lg:border-2 lg:px-5"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Nova senha"
                                                value={senhaNova}
                                                onChange={(e) => setSenhaNova(e.target.value)}
                                                disabled={saving}
                                                className="h-[42px] w-full rounded-lg border border-[var(--color-base)] bg-white px-3 text-base text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)] lg:h-14 lg:rounded-xl lg:border-2 lg:px-5"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirmar nova senha"
                                                value={senhaNovaConfirm}
                                                onChange={(e) =>
                                                    setSenhaNovaConfirm(e.target.value)
                                                }
                                                disabled={saving}
                                                className="h-[42px] w-full rounded-lg border border-[var(--color-base)] bg-white px-3 text-base text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)] lg:h-14 lg:rounded-xl lg:border-2 lg:px-5"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handlePasswordSave}
                                                    disabled={saving}
                                                    className="flex-1 rounded-lg bg-[var(--color-base)] px-3 py-2 font-semibold text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50 lg:rounded-xl lg:px-4 lg:py-3"
                                                >
                                                    {saving ? 'Salvando...' : 'Salvar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelPasswordEdit}
                                                    disabled={saving}
                                                    className="flex-1 rounded-lg bg-[var(--cinza-200)] px-3 py-2 font-semibold text-[var(--cinza-700)] transition-colors hover:bg-[var(--cinza-300)] disabled:opacity-50 lg:rounded-xl lg:px-4 lg:py-3"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <input
                                                    id="password-display"
                                                    type="password"
                                                    value="************"
                                                    disabled
                                                    className="h-[42px] w-full rounded-lg border border-[var(--cinza-500)] bg-white px-3 pr-12 text-base text-[var(--cinza-700)] opacity-100 outline-none lg:h-14 lg:rounded-xl lg:border-2 lg:px-5 lg:text-base lg:text-[var(--cinza-500)]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingPassword(true)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)] lg:hidden"
                                                    aria-label="Alterar senha"
                                                >
                                                    <PenLine className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="mt-5 hidden justify-center lg:flex">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingPassword(true)}
                                                    className="rounded-xl bg-[var(--color-base)] px-7 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-dark)]"
                                                >
                                                    Alterar a senha
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="hidden justify-center lg:flex">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="text-[var(--color-alert)] transition-colors hover:text-[var(--color-alert-hover)]"
                                    >
                                        Deletar sua conta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto mt-16 w-full max-w-[327px] lg:hidden">
                        <p className="mb-3 font-inter text-base font-medium text-black">
                            Plano Atual:
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowPlanos(true)}
                            className="flex min-h-12 w-full items-center justify-between gap-3 bg-[#f3f3f3] px-4 py-2.5 text-left"
                        >
                            <span className="font-inter text-[15px] font-medium text-[var(--color-variant)]">
                                {currentPlan.name}
                            </span>
                            <span className="shrink-0 font-inter text-[15px] font-medium text-[var(--color-base)]">
                                Fazer Upgrade
                            </span>
                        </button>
                    </section>

                    <div className="mx-auto mt-16 flex w-full max-w-[327px] items-center justify-between gap-4 lg:hidden">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-base font-medium text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)]"
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-right text-base font-medium text-[var(--color-alert)] transition-colors hover:text-[var(--color-alert-hover)]"
                        >
                            Deletar sua conta
                        </button>
                    </div>

                    <div className="mt-12 hidden lg:block">
                        <Planos variant="inline" currentPlanName={currentPlan.name} />
                    </div>
                </div>

                {showPlanos && (
                    <Planos
                        onClose={() => setShowPlanos(false)}
                        currentPlanName={currentPlan.name}
                    />
                )}

                {fotoParaCortar && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
                        <div className="w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white px-5 py-5 shadow-[var(--external-shadow)]">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <Title2 className="text-[24px] leading-tight text-[var(--cinza-700)]">
                                    Ajustar foto
                                </Title2>
                                <button
                                    type="button"
                                    onClick={handleCancelarCorteFoto}
                                    disabled={saving}
                                    className="shrink-0 rounded-lg p-1 text-[var(--color-base)] transition-colors hover:bg-[var(--roxo-light)] disabled:opacity-50"
                                    aria-label="Fechar corte de foto"
                                    title="Fechar"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div
                                ref={areaCorteRef}
                                onPointerDown={iniciarArrasteCorte}
                                onPointerMove={moverArrasteCorte}
                                onPointerUp={finalizarArrasteCorte}
                                onPointerCancel={finalizarArrasteCorte}
                                className="relative mx-auto aspect-square w-full max-w-[320px] touch-none select-none overflow-hidden rounded-lg bg-black"
                            >
                                {dimensoesFotoCorte && (
                                    <img
                                        src={fotoParaCortar.src}
                                        alt=""
                                        draggable="false"
                                        className="absolute left-1/2 top-1/2 max-w-none select-none"
                                        style={{
                                            width: `${dimensoesFotoCorte.larguraRenderizada}px`,
                                            height: `${dimensoesFotoCorte.alturaRenderizada}px`,
                                            transform: `translate(-50%, -50%) translate(${corteFoto.offsetX}px, ${corteFoto.offsetY}px)`,
                                        }}
                                    />
                                )}
                                <div className="pointer-events-none absolute inset-0">
                                    <div className="absolute left-1/3 top-0 h-full w-px bg-white/70" />
                                    <div className="absolute left-2/3 top-0 h-full w-px bg-white/70" />
                                    <div className="absolute left-0 top-1/3 h-px w-full bg-white/70" />
                                    <div className="absolute left-0 top-2/3 h-px w-full bg-white/70" />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-white/90" />
                                    <div className="absolute inset-[10%] rounded-full border border-white/80" />
                                </div>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <ParagraphMedium className="font-semibold text-[var(--cinza-700)]">
                                            Zoom
                                        </ParagraphMedium>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                atualizarCorteFoto({
                                                    zoom: ZOOM_MINIMO,
                                                    offsetX: 0,
                                                    offsetY: 0,
                                                })
                                            }
                                            disabled={saving}
                                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-[var(--color-base)] transition-colors hover:bg-[var(--roxo-light)] disabled:opacity-50"
                                            title="Centralizar"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            Centralizar
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                atualizarCorteFoto((corteAtual) => ({
                                                    zoom: corteAtual.zoom - 0.1,
                                                }))
                                            }
                                            disabled={saving || corteFoto.zoom <= ZOOM_MINIMO}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--cinza-500)] text-[var(--color-base)] transition-colors hover:bg-[var(--roxo-light)] disabled:opacity-40"
                                            aria-label="Diminuir zoom"
                                            title="Diminuir zoom"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input
                                            type="range"
                                            min={ZOOM_MINIMO}
                                            max={ZOOM_MAXIMO}
                                            step="0.01"
                                            value={corteFoto.zoom}
                                            onChange={(event) =>
                                                atualizarCorteFoto({
                                                    zoom: Number(event.target.value),
                                                })
                                            }
                                            disabled={saving}
                                            className="w-full accent-[var(--color-base)]"
                                            aria-label="Zoom da foto"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                atualizarCorteFoto((corteAtual) => ({
                                                    zoom: corteAtual.zoom + 0.1,
                                                }))
                                            }
                                            disabled={saving || corteFoto.zoom >= ZOOM_MAXIMO}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--cinza-500)] text-[var(--color-base)] transition-colors hover:bg-[var(--roxo-light)] disabled:opacity-40"
                                            aria-label="Aumentar zoom"
                                            title="Aumentar zoom"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <ParagraphMedium className="mb-2 font-semibold text-[var(--cinza-700)]">
                                        Horizontal
                                    </ParagraphMedium>
                                    <input
                                        type="range"
                                        min={-limitesCorte.x}
                                        max={limitesCorte.x}
                                        step="1"
                                        value={corteFoto.offsetX}
                                        onChange={(event) =>
                                            atualizarCorteFoto({
                                                offsetX: Number(event.target.value),
                                            })
                                        }
                                        disabled={saving || limitesCorte.x === 0}
                                        className="w-full accent-[var(--color-base)] disabled:opacity-40"
                                        aria-label="Posição horizontal da foto"
                                    />
                                </div>

                                <div>
                                    <ParagraphMedium className="mb-2 font-semibold text-[var(--cinza-700)]">
                                        Vertical
                                    </ParagraphMedium>
                                    <input
                                        type="range"
                                        min={-limitesCorte.y}
                                        max={limitesCorte.y}
                                        step="1"
                                        value={corteFoto.offsetY}
                                        onChange={(event) =>
                                            atualizarCorteFoto({
                                                offsetY: Number(event.target.value),
                                            })
                                        }
                                        disabled={saving || limitesCorte.y === 0}
                                        className="w-full accent-[var(--color-base)] disabled:opacity-40"
                                        aria-label="Posição vertical da foto"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancelarCorteFoto}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg border border-[var(--cinza-500)] px-4 py-2 font-semibold text-[var(--cinza-700)] transition-colors hover:bg-[var(--cinza-200)] disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSalvarFotoCortada}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg bg-[var(--color-base)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50"
                                >
                                    <Check className="h-4 w-4" />
                                    {saving ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 py-6">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                handleDeleteAccount();
                            }}
                            className="relative w-full max-w-[calc(100vw-24px)] rounded-[34px] bg-white px-8 py-11 shadow-[var(--external-shadow)] sm:px-10 lg:max-w-[900px] lg:rounded-[28px] lg:px-16 lg:py-10"
                        >
                            <button
                                type="button"
                                onClick={closeDeleteConfirm}
                                disabled={saving}
                                className="absolute right-5 top-5 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)] disabled:opacity-50 lg:right-9 lg:top-9"
                                aria-label="Fechar confirmação"
                            >
                                <X className="h-5 w-5 lg:h-7 lg:w-7" strokeWidth={3.4} />
                            </button>

                            <Title2 className="pr-7 text-left text-[30px] leading-tight text-black lg:pr-8 lg:text-center lg:text-[28px]">
                                Tem certeza que deseja deletar sua conta?
                            </Title2>

                            <div className="mx-auto mt-9 w-full lg:mt-14 lg:max-w-[520px]">
                                <ParagraphMedium className="mb-4 text-center text-xl font-semibold text-[var(--color-dark)] lg:text-xl">
                                    Para prosseguir digite o e-mail de cadastro
                                </ParagraphMedium>
                                <input
                                    type="email"
                                    value={deleteEmail}
                                    onChange={(event) => {
                                        setDeleteEmail(event.target.value);
                                        setDeleteError('');
                                    }}
                                    placeholder="Digite seu e-mail"
                                    disabled={saving}
                                    className="h-12 w-full rounded-xl border-2 border-[var(--cinza-500)] bg-white px-4 text-lg text-[var(--cinza-700)] opacity-100 outline-none focus:border-[var(--color-base)] lg:h-11 lg:border-black lg:text-base"
                                />
                                {deleteError && (
                                    <ParagraphMedium className="mt-3 text-center text-[var(--color-base)]">
                                        {deleteError}
                                    </ParagraphMedium>
                                )}
                            </div>

                            <div className="mx-auto mt-16 flex w-full justify-end lg:mt-9 lg:max-w-[620px]">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-[var(--color-base)] px-10 py-3 text-lg font-medium text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50 lg:px-8 lg:py-2 lg:text-base"
                                >
                                    {saving ? 'Verificando...' : 'Prosseguir'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Configuracao;
