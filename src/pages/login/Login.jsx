import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImg from '../../assets/logo(1).svg';
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className="w-full max-w-7xl">
                <div className="flex justify-center mb-8">
                    <img src={LogoImg} className="w-32 md:w-44 lg:w-64 h-auto" alt="Escopo" />
                </div>

                <div className="flex flex-col md:flex-row items-stretch gap-8">
                    <div className="w-full md:w-[45%]">
                        <div className="rounded-4xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8 h-full">
                            <h1 className="text-2xl font-bold text-center text-gray-900! mb-8">
                                Login
                            </h1>

                            {error && (
                                <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </p>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">
                                        E-mail
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Digite seu email"
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
                                        className="text-[#552ba9] hover:text-[#42257c] text-sm font-medium transition"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 pt-4">
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
                    </div>

                    <div className="w-full md:w-[50%]">
                        <Carrossel />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
