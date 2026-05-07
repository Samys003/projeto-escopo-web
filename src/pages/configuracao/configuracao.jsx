import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Trash2 } from 'lucide-react';
import MobileHeader from '../../components/MobileHeader.jsx';
import ParagraphLarge from '../../components/Typography/ParagraphLarge.jsx';
import ParagraphMedium from '../../components/Typography/ParagraphMedium.jsx';
import Title3 from '../../components/Typography/Title3.jsx';
import {
    updateUserName,
    updateUserProfilePicture,
    deleteUserAccount,
    getUserByEmail,
} from '../../services/api.js';

function Configuracao() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fotoPreview, setFotoPreview] = useState(null);
    const [editingNome, setEditingNome] = useState(false);
    const [nomeTemp, setNomeTemp] = useState('');
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

            <main className="px-4 py-6 sm:px-6 sm:py-8 max-w-md mx-auto">
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
                    <div className=" text-center">
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
                                    className="absolute bottom-0 right-0 bg-[var(--color-base)] text-white rounded-full p-2 cursor-pointer hover:bg-[var(--color-base)] transition-colors shadow-md"
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
                                        className="px-6 py-2 bg-[var(--color-base)] text-white rounded-lg font-medium hover:bg-[var(--color-base-hover)] disabled:opacity-50 transition-colors"
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
                            <div className="mb-4">
                                <Title3 className="text-gray-900 mb-2">
                                    {usuario?.nome || 'Usuário'}
                                </Title3>
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
                            <input
                                type="password"
                                value={usuario?.senha || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                            <button
                                onClick={() => setEditingSenha(true)}
                                className="w-50% flex items-center justify-center gap-3 px-4 py-3 bg-[var(--color-base)] text-white rounded-lg font-medium border-2 transition-colors mt-4"
                            >
                                Alterar
                            </button>
                        </div>
                    </div>
                    <section className="mb-8">
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-[var(--color-base)] text-sm font-medium hover:text-[var(--color-base-hover)] transition-colors"
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
                                        className="flex-1 px-4 py-2 bg-[var(--color-base)] text-white rounded-lg font-medium hover:bg-[var(--color-variant)] disabled:opacity-50 transition-colors"
                                    >
                                        {saving ? 'Deletando...' : 'Deletar'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </div>
    );
}

export default Configuracao;
