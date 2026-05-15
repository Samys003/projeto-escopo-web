import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, PenLine, Trash2 } from 'lucide-react';
import MobileHeader from '../../components/MobileHeader.jsx';
import DesktopSidebar from '../../components/DesktopSidebar.jsx';
import Planos from './components/planos.jsx';
import { plans } from './components/planos.jsx';
import {
    updateUserName,
    updateUserProfilePicture,
    deleteUserAccount,
    updatePassword,
} from '../../services/api.js';
import Title3 from '../../components/Typography/Title3.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import ParagraphMedium from '../../components/Typography/ParagraphMedium.jsx';
import Title4 from '../../components/Typography/Title4.jsx';

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

function Configuracao() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fotoPreview, setFotoPreview] = useState(null);
    const [editingNome, setEditingNome] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [nomeTemp, setNomeTemp] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    const [senhaNovaConfirm, setSenhaNovaConfirm] = useState('');
    const [showPlanos, setShowPlanos] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const currentPlan = useMemo(() => getCurrentPlan(usuario), [usuario]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const usuarioArmazenado = localStorage.getItem('authUser');
                if (usuarioArmazenado) {
                    const user = JSON.parse(usuarioArmazenado);
                    setUsuario(user);
                    setNomeTemp(user.nome || '');
                    setFotoPreview(user.foto_perfil || null);
                }
            } catch {
                setError('Erro ao carregar dados do usuário');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleNomeSave = async () => {
        if (!nomeTemp.trim()) {
            setError('Nome não pode ser vazio');
            return;
        }

        if (nomeTemp === usuario?.nome) {
            setEditingNome(false);
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            await updateUserName({ nome: nomeTemp.trim() });

            const usuarioAtualizado = { ...usuario, nome: nomeTemp.trim() };
            setUsuario(usuarioAtualizado);
            localStorage.setItem('authUser', JSON.stringify(usuarioAtualizado));

            setEditingNome(false);
            setSuccess('Nome atualizado com sucesso!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Erro ao atualizar nome');
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
            setError(err.message || 'Erro ao atualizar senha');
        } finally {
            setSaving(false);
        }
    };

    const handleFotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                try {
                    await updateUserProfilePicture({ foto_perfil: base64String });

                    const usuarioAtualizado = { ...usuario, foto_perfil: base64String };
                    setUsuario(usuarioAtualizado);
                    setFotoPreview(base64String);
                    localStorage.setItem('authUser', JSON.stringify(usuarioAtualizado));

                    setSuccess('Foto de perfil atualizada com sucesso!');
                    setTimeout(() => setSuccess(''), 3000);
                } catch (err) {
                    setError(err.message || 'Erro ao atualizar foto de perfil');
                } finally {
                    setSaving(false);
                }
            };
            reader.readAsDataURL(file);
        } catch {
            setError('Erro ao processar imagem');
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setSaving(true);
            setError('');

            await deleteUserAccount();

            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');

            navigate('/');
        } catch (err) {
            setError(err.message || 'Erro ao deletar conta');
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

            <main className="flex-1 px-5 py-8 sm:px-8 lg:px-8 lg:py-14 xl:px-20">
                <div className="mx-auto flex w-full max-w-[1240px] flex-col">
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

                    <section className="grid items-start gap-9 lg:grid-cols-[minmax(300px,470px)_minmax(240px,360px)] lg:justify-between lg:gap-8 xl:gap-24">
                        <div className="order-1 flex flex-col items-center lg:order-2 lg:pt-16">
                            <div className="relative">
                                <div className="flex aspect-square w-[min(68vw,18rem)] items-center justify-center overflow-hidden rounded-full border-4 border-[var(--color-base)] bg-[var(--cinza-200)] sm:w-80 lg:w-[280px] xl:w-[330px]">
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
                                    className="absolute bottom-3 right-3 flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] sm:h-[60px] sm:w-[60px] lg:bottom-2 lg:right-5"
                                    aria-label="Alterar foto"
                                >
                                    <Camera size={25} />
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
                                            <PenLine size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 flex w-full flex-col items-center lg:hidden">
                                {editingNome ? (
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={nomeTemp}
                                            onChange={(e) => setNomeTemp(e.target.value)}
                                            className="w-full rounded-2xl border-2 border-[var(--color-base)] bg-white px-4 py-3 text-center text-2xl font-semibold text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)]"
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
                                        <Title2 className="break-words text-center text-4xl leading-tight text-[var(--cinza-700)] sm:text-5xl">
                                            {usuario?.nome || 'Usuário'}
                                        </Title2>
                                        <button
                                            type="button"
                                            onClick={() => setEditingNome(true)}
                                            className="shrink-0 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)]"
                                            aria-label="Editar nome"
                                        >
                                            <PenLine size={30} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="order-2 w-full lg:order-1 lg:pt-24">
                            <div className="space-y-7">
                                <div>
                                    <label htmlFor="email" className="mb-2 block">
                                        <ParagraphMedium className="text-[28px] font-semibold text-[var(--cinza-700)] lg:text-base">
                                            E-mail
                                        </ParagraphMedium>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={usuario?.email || ''}
                                        disabled
                                        className="h-[60px] w-full rounded-2xl border-2 border-[var(--cinza-500)] bg-white px-5 text-[26px] text-[var(--cinza-700)] opacity-100 outline-none lg:h-14 lg:rounded-xl lg:text-base lg:text-[var(--cinza-500)]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password-display" className="mb-2 block">
                                        <ParagraphMedium className="text-[28px] font-semibold text-[var(--cinza-700)] lg:text-base">
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
                                                className="h-14 w-full rounded-xl border-2 border-[var(--color-base)] bg-white px-5 text-base text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Nova senha"
                                                value={senhaNova}
                                                onChange={(e) => setSenhaNova(e.target.value)}
                                                disabled={saving}
                                                className="h-14 w-full rounded-xl border-2 border-[var(--color-base)] bg-white px-5 text-base text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirmar nova senha"
                                                value={senhaNovaConfirm}
                                                onChange={(e) =>
                                                    setSenhaNovaConfirm(e.target.value)
                                                }
                                                disabled={saving}
                                                className="h-14 w-full rounded-xl border-2 border-[var(--color-base)] bg-white px-5 text-base text-[var(--cinza-700)] outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handlePasswordSave}
                                                    disabled={saving}
                                                    className="flex-1 rounded-xl bg-[var(--color-base)] px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50"
                                                >
                                                    {saving ? 'Salvando...' : 'Salvar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelPasswordEdit}
                                                    disabled={saving}
                                                    className="flex-1 rounded-xl bg-[var(--cinza-200)] px-4 py-3 font-semibold text-[var(--cinza-700)] transition-colors hover:bg-[var(--cinza-300)] disabled:opacity-50"
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
                                                    className="h-[60px] w-full rounded-2xl border-2 border-[var(--cinza-500)] bg-white px-5 pr-16 text-[26px] text-[var(--cinza-700)] opacity-100 outline-none lg:h-14 lg:rounded-xl lg:text-base lg:text-[var(--cinza-500)]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingPassword(true)}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)] lg:hidden"
                                                    aria-label="Alterar senha"
                                                >
                                                    <PenLine size={32} />
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
                                        className="text-[var(--color-base)] transition-colors hover:text-red-700"
                                    >
                                        Deletar sua conta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-20 lg:hidden">
                        <Title2 className="mb-6 text-[28px] ">Plano Atual:</Title2>
                        <button
                            type="button"
                            onClick={() => setShowPlanos(true)}
                            className="flex w-full items-center justify-between gap-4 bg-[var(--cinza-100)] px-6 py-7 text-left sm:px-10 sm:py-8"
                        >
                            <Title4 className="text-[22px] text-[var(--color-variant)] sm:text-[28px]">
                                {currentPlan.name}
                            </Title4>
                            <Title3 className="text-[22px] text-[var(--color-base)] sm:text-[28px]">
                                Fazer Upgrade
                            </Title3>
                        </button>
                    </section>

                    <div className="mt-12 hidden lg:block">
                        <Planos variant="inline" currentPlanName={currentPlan.name} />
                    </div>

                    <div className="mt-32 flex items-center justify-between gap-4 lg:hidden">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-[22px] font-medium text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)] sm:text-[28px]"
                        >
                            <LogOut size={30} />
                            Sair
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-right text-[22px] font-medium text-[var(--color-base)] transition-colors hover:text-red-700 sm:text-[28px]"
                        >
                            Deletar sua conta
                        </button>
                    </div>
                </div>

                {showPlanos && (
                    <Planos
                        onClose={() => setShowPlanos(false)}
                        currentPlanName={currentPlan.name}
                    />
                )}

                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[var(--external-shadow)]">
                            <div className="mb-4 flex items-center gap-3 text-[var(--color-base)]">
                                <Trash2 size={24} />
                                <Title2 className="text-xl font-semibold">Deletar sua conta</Title2>
                            </div>
                            <ParagraphMedium className="mb-6 text-[var(--cinza-700)]">
                                Tem certeza que deseja deletar sua conta? Essa ação não pode ser
                                desfeita.
                            </ParagraphMedium>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-[var(--cinza-200)] px-4 py-3 font-semibold text-[var(--cinza-700)] transition-colors hover:bg-[var(--cinza-300)] disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-[var(--color-base)] px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-50"
                                >
                                    {saving ? 'Deletando...' : 'Deletar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Configuracao;
