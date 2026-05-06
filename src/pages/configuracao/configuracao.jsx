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
    const [editingNome, setEditingNome] = useState(false);
    const [nomeTemp, setNomeTemp] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [fotoPreview, setFotoPreview] = useState(null);

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
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="mb-4">
                            <ParagraphMedium className="text-gray-700 font-medium mb-2">
                                E-mail
                            </ParagraphMedium>
                            <input
                                type="email"
                                value={usuario?.email || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Configuracao;
