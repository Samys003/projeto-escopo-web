import LogoImg from '../../assets/logo(1).svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register as registerApi } from '../../services/api';

function Cadastro() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await registerApi({ nome, email, senha });
            navigate('/Login');
        } catch (err) {
            setError(err.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <img src={LogoImg} className="w-64 h-auto" alt="Escopo" />
                </div>
                <div className="rounded-4xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-900! mb-8">Cadastro</h1>

                    {error && (
                        <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">Nome</label>
                            <input
                                name="nome"
                                type="text"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                placeholder="Digite seu nome"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#552ba9] text-gray-700 placeholder-gray-400 transition"
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
                                placeholder="Digite seu email"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#552ba9] text-gray-700 placeholder-gray-400 transition"
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
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#552ba9] text-gray-700 placeholder-gray-400 transition"
                                required
                            />
                        </div>

                        <div className="flex justify-center gap-2 pt-4 text-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className=" py-3 w-30 mt-2 rounded-2xl bg-[var(--color-base)] text-white text-base font-semibold hover:bg-[var(--color-base)] disabled:cursor-not-allowed disabled:opacity-60 transition"
                            >
                                {loading ? 'Cadastrando...' : 'Cadastre-se'}
                            </button>
                        </div>
                        <Link
                            to="/Login"
                            className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-2xl text-[#552ba9] font-semibold hover:bg-gray-50 transition"
                        >
                            <span>Voltar</span>
                            <span className="text-xl">↩︎</span>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;
