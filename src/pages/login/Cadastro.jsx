import LogoImg from '../../assets/logotipo-desktop.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Undo2 } from 'lucide-react';
import LoginFeedback from './components/LoginFeedback';
import { getApiErrorMessage, register as registerApi } from '../../services/api';

function Cadastro() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validarFormulario = () => {
        if (!nome.trim()) {
            setError('Informe seu nome.');
            return false;
        }

        if (nome.trim().length < 2) {
            setError('Informe um nome válido.');
            return false;
        }

        if (!email.trim()) {
            setError('Informe seu e-mail.');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
            setError('Informe um e-mail válido, como nome@dominio.com.');
            return false;
        }

        if (!senha.trim()) {
            setError('Informe uma senha.');
            return false;
        }

        if (senha.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!validarFormulario()) {
            return;
        }

        setLoading(true);

        try {
            await registerApi({ nome: nome.trim(), email: email.trim(), senha });
            navigate('/Login', {
                state: { success: 'Cadastro criado com sucesso. Faça login para continuar.' },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, 'Não foi possível criar sua conta. Tente novamente.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-5 py-8 sm:px-6 lg:px-10 lg:py-12"
            style={{ backgroundImage: 'var(--login-background)' }}
        >
            <div className="w-full max-w-[41.75rem]">
                <div className="mb-8 flex justify-center lg:mb-10">
                    <img
                        src={LogoImg}
                        className="h-auto w-[clamp(12rem,23vw,21rem)] max-w-full"
                        alt="Escopo"
                    />
                </div>
                <div className="rounded-[2.25rem] bg-white p-6 shadow-[var(--external-shadow)] sm:p-8 lg:px-[3.75rem] lg:py-10">
                    <p className="mb-5 text-center text-2xl font-bold leading-snug text-[var(--color-base)]">
                        Transforme ideias em requisitos bem definidos.
                    </p>
                    <h1 className="mb-5 text-center text-3xl font-bold text-gray-800">Cadastro</h1>

                    <LoginFeedback mensagem={error} className="mx-auto max-w-[22.5rem]" />

                    <form
                        className="mx-auto w-full max-w-[22.5rem] space-y-5"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">Nome</label>
                            <input
                                name="nome"
                                type="text"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                placeholder="Digite seu nome"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-base)] text-gray-700 placeholder-gray-400 transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">E-mail</label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Digite seu e-mail"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-base)] text-gray-700 placeholder-gray-400 transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-800 font-medium mb-2">Senha</label>
                            <input
                                name="senha"
                                type="password"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                                placeholder="Digite sua senha"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-base)] text-gray-700 placeholder-gray-400 transition"
                                required
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                to="/Login"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 font-semibold text-[var(--color-base)] transition hover:bg-gray-50 sm:min-w-[7rem]"
                            >
                                <span>Voltar</span>
                                <Undo2 size={20} strokeWidth={2.2} />
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 rounded-lg bg-[var(--color-base)] px-6 text-base font-semibold text-white transition hover:bg-[var(--color-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[6.75rem]"
                            >
                                {loading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;
