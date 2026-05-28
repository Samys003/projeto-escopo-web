import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImg from '../../assets/logotipo-desktop.svg';
import Carrossel from './components/Carrossel';
import { login as loginApi } from '../../services/api';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginApi({ email, senha });
            const token = response?.token;
            const usuario = response?.usuario;

            if (!token) {
                throw new Error('Resposta da API sem token. Tente novamente.');
            }

            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(usuario || { email }));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Erro ao efetuar login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-5 py-8 sm:px-6 lg:px-10 lg:py-12"
            style={{ backgroundImage: 'var(--login-background)' }}
        >
            <div className="w-full max-w-[73.5rem]">
                <div className="mb-8 flex justify-center lg:mb-12">
                    <img
                        src={LogoImg}
                        className="h-auto w-[clamp(12rem,23vw,21rem)] max-w-full"
                        alt="Escopo"
                    />
                </div>

                <div className="grid grid-cols-1 items-start justify-center gap-8 lg:grid-cols-[minmax(20rem,26.625rem)_minmax(31rem,34.875rem)] lg:gap-[clamp(4rem,9vw,9rem)]">
                    <section className="w-full">
                        <div className="flex min-h-[29rem] flex-col justify-center rounded-[2.25rem] bg-white p-6 shadow-[var(--external-shadow)] sm:p-8 lg:min-h-[32.25rem] lg:px-7 lg:py-12">
                            <h1 className="mx-auto mb-8 max-w-[23rem] text-center text-2xl font-bold leading-snug text-[var(--color-base)]">
                                Transforme ideias em requisitos bem definidos.
                            </h1>
                            <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
                                Login
                            </h2>
                            {error && (
                                <p className="mx-auto mb-4 max-w-[17rem] rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </p>
                            )}
                            <form
                                className="mx-auto w-full max-w-[17rem] space-y-5"
                                onSubmit={handleSubmit}
                            >
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">
                                        E-mail
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Digite seu e-mail"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#552ba9] text-gray-700 placeholder-gray-400 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">
                                        Senha
                                    </label>
                                    <input
                                        name="senha"
                                        type="password"
                                        value={senha}
                                        onChange={(event) => setSenha(event.target.value)}
                                        placeholder="Digite sua senha"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#552ba9] text-gray-700 placeholder-gray-400 transition"
                                        required
                                    />
                                </div>

                                <div className="text-right">
                                    <Link
                                        to="/Senha"
                                        className="text-[var(--color-base)] hover:text-[var(--color-dark)] text-sm font-medium transition"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-center">
                                    <Link
                                        to="/cadastro"
                                        className="flex-1 py-3 bg-white border-2 border-[#552ba9] text-[#552ba9] font-semibold rounded-lg hover:bg-purple-50 transition text-center"
                                    >
                                        Cadastre-se
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-[#552ba9] text-white font-semibold rounded-lg hover:bg-[#42257c] transition disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? 'Entrando...' : 'Entrar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <div className="w-full">
                        <Carrossel />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
