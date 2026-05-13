import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Pen, PenLine, Trash2 } from 'lucide-react';
import MobileHeader from '../../components/MobileHeader.jsx';
import ParagraphMedium from '../../components/Typography/ParagraphMedium.jsx';
import Title3 from '../../components/Typography/Title3.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import Title1 from '../../components/Typography/Title1.jsx';
import Planos from './components/planos.jsx';
import {
    updateUserName,
    updateUserProfilePicture,
    deleteUserAccount,
    getUserByEmail,
    updatePassword,
} from '../../services/api.js';
import Title4 from '../../components/Typography/Title4.jsx';

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
            } catch (err) {
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

        if (nomeTemp === usuario.nome) {
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
        } catch (err) {
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

    if (loading) {
        return (
            <div className="bg-[#f8f8f8] min-h-screen">
                <MobileHeader />
                <main className="flex items-center justify-center px-4 py-12">
                    <p className="text-gray-600">Carregando...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f8f8] min-h-screen">
            <MobileHeader />

            <main className="px-4 py-6 sm:px-6 sm:py-8 max-w-5xl mx-auto">
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200">
                        <p className="text-sm text-green-700">{success}</p>
                    </div>
                )}

                <section className="mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="md:w-1/3 flex justify-center">
                            <div className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-40 h-40 rounded-full border-2 border-[var(--color-base)] overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {fotoPreview ? (
                                                <img
                                                    src={fotoPreview}
                                                    alt="Foto de perfil"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-4xl text-gray-400"></div>
                                            )}
                                        </div>
                                        <label
                                            htmlFor="foto-input"
                                            className="absolute bottom-0 right-0 bg-[var(--color-base)] text-white rounded-full p-2 cursor-pointer hover:bg-[var(--color-dark)] transition-colors shadow-md"
                                        >
                                            <Camera size={16} />
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
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 space-y-6">
                            {editingNome ? (
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={nomeTemp}
                                        onChange={(e) => setNomeTemp(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-[var(--color-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                        disabled={saving}
                                    />
                                    <div className="flex gap-2 mt-3 justify-center">
                                        <button
                                            onClick={handleNomeSave}
                                            disabled={saving}
                                            className="px-6 py-2 bg-[var(--color-base)] text-white rounded-lg font-medium hover:bg-[var(--color-dark)] disabled:opacity-50 transition-colors"
                                        >
                                            {saving ? 'Salvando...' : 'Salvar'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingNome(false);
                                                setNomeTemp(usuario.nome || '');
                                            }}
                                            disabled={saving}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4 relative">
                                    <Title3 className="text-gray-900 mb-2">
                                        {usuario?.nome || 'Usuário'}
                                    </Title3>
                                    <label
                                        htmlFor="nome-input"
                                        onClick={() => setEditingNome(true)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[var(--color-base)] hover:text-[var(--color-dark)] transition-colors"
                                        style={{ transform: 'translate(-99%, -1%)' }}
                                    >
                                        <PenLine size={16} />
                                    </label>
                                </div>
                            )}

                            <div className="mb-4">
                                <ParagraphMedium className="text-gray-700 font-medium mb-1 text-left">
                                    E-mail
                                </ParagraphMedium>
                                <input
                                    type="email"
                                    value={usuario?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed mb-4"
                                />
                                <ParagraphMedium className="text-gray-700 font-medium mb-1 text-left">
                                    Senha
                                </ParagraphMedium>
                                {editingPassword ? (
                                    <div className="space-y-3">
                                        <input
                                            type="password"
                                            placeholder="Senha atual"
                                            value={senhaAtual}
                                            onChange={(e) => setSenhaAtual(e.target.value)}
                                            disabled={saving}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Nova senha"
                                            value={senhaNova}
                                            onChange={(e) => setSenhaNova(e.target.value)}
                                            disabled={saving}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirmar nova senha"
                                            value={senhaNovaConfirm}
                                            onChange={(e) => setSenhaNovaConfirm(e.target.value)}
                                            disabled={saving}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-base)]"
                                        />
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={handlePasswordSave}
                                                disabled={saving}
                                                className="flex-1 px-4 py-2 bg-[var(--color-base)] text-white rounded-lg font-medium hover:bg-[var(--color-dark)] disabled:opacity-50 transition-colors"
                                            >
                                                {saving ? 'Salvando...' : 'Salvar'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingPassword(false);
                                                    setSenhaAtual('');
                                                    setSenhaNova('');
                                                    setSenhaNovaConfirm('');
                                                }}
                                                disabled={saving}
                                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value="••••••••"
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed mb-4"
                                        />
                                        <label
                                            htmlFor="password-input"
                                            onClick={() => setEditingPassword(true)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[var(--color-base)] hover:text-[var(--color-dark)] transition-colors"
                                            style={{ transform: 'translateY(-50%)' }}
                                        >
                                            <PenLine size={16} />
                                        </label>

                                        {/* <button
                                            onClick={() => setEditingPassword(true)}
                                            className="w-50% flex items-center justify-center gap-3 px-4 py-3 bg-[var(--color-base)] hover:bg-[var(--color-dark)] text-white rounded-lg font-medium border-2 transition-colors mt-4"
                                        >
                                            Alterar Senha
                                        </button>
                                        <button
                                            onClick={() => setEditingNome(true)}
                                            className="w-50% flex items-center justify-center gap-3 px-4 py-3 bg-[var(--color-base)] hover:bg-[var(--color-dark)] text-white rounded-lg font-medium border-2 transition-colors mt-4"
                                        >
                                            Alterar Nome
                                        </button> */}
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 mb-5 align-left">
                                <Title1 className="text-gray-700 font-medium align-left text-left">
                                    Plano Atual:
                                </Title1>
                                <div className="rounded-[5px] bg-[var(--cinza-200)] p-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <Title4 className="text-[var(--color-variant)]">
                                                {Planos[usuario?.plano_atual]?.nome || 'Free'}
                                            </Title4>
                                            <button
                                                onClick={() => setShowPlanos(true)}
                                                className="text-[var(--color-base)] font-semibold hover:text-[var(--color-dark)] transition-colors right text-right"
                                            >
                                                Fazer Upgrade
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <button
                            onClick={handleLogout}
                            className="text-[var(--color-base)] text-sm font-medium hover:text-[var(--color-dark)] transition-colors gap-2 flex items-center justify-center mb-4 mt-4"
                        >
                            <LogOut size={16} />
                            Sair
                        </button>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-[var(--color-base)] text-sm font-medium hover:text-red-700 transition-colors"
                            >
                                Deletar Conta
                            </button>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-[var(--color-variant)]">
                                <p className="text-gray-700 mb-4 text-center">
                                    Tem certeza que deseja deletar sua conta?.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-[var(--cinza-300)] disabled:opacity-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-[var(--color-base)] text-white rounded-lg font-medium hover:bg-[var(--color-dark)] disabled:opacity-50 transition-colors"
                                    >
                                        {saving ? 'Deletando...' : 'Deletar'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {showPlanos && <Planos onClose={() => setShowPlanos(false)} />}
            </main>
        </div>
    );
}

export default Configuracao;
