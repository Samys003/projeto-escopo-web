import LogoImg from '../../assets/logo(1).svg';
import Login from './Login';
import { Link } from 'react-router-dom';

function Redefinir() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <img src={LogoImg} className="w-64 h-auto" alt="Escopo" />
                </div>
                <div className="rounded-4xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-900! mb-10">
                        Redefinir Senha
                    </h1>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                placeholder="Digite sua nova senha"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#552ba9] text-gray-700 placeholder-gray-400 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                placeholder="Digite novamente sua nova senha"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#552ba9] text-gray-700 placeholder-gray-400 transition"
                            />
                        </div>

                        <div className="flex justify-center gap-2 pt-4 text-center">
                            <Link
                                type="submit"
                                to="/Login"
                                className=" py-3 w-20 mt-2 rounded-2xl bg-[#552ba9] text-white text-base font-semibold hover:bg-[#42257c] transition"
                            >
                                Entrar
                            </Link>
                        </div>
                        <Link
                            type="button"
                            to="/Senha"
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

export default Redefinir;
