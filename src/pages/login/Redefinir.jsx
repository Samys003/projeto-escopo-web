import LogoImg from '../../assets/logotipo-desktop.svg';
import { Link } from 'react-router-dom';
import { Undo2 } from 'lucide-react';
import Title2 from '../../components/Typography/Title2';
import Title3 from '../../components/Typography/Title3';
import Title4 from '../../components/Typography/Title4';

function Redefinir() {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-5 py-8 sm:px-6 lg:px-10 lg:py-12"
            style={{ backgroundImage: 'var(--login-background)' }}
        >
            <div className="w-full max-w-[27.5rem]">
                <div className="mb-8 flex justify-center lg:mb-14">
                    <img
                        src={LogoImg}
                        className="h-auto w-[clamp(12rem,23vw,21rem)] max-w-full"
                        alt="Escopo"
                    />
                </div>
                <div className="rounded-[2.25rem] bg-white p-6 shadow-[var(--external-shadow)] sm:p-8 lg:px-10 lg:py-11">
                    <Title2 className="mb-12 text-center text-3xl font-medium text-black">
                        Redefinir Senha
                    </Title2>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Nova senha
                            </label>
                            <input
                                type="password"
                                placeholder="Digite sua nova senha"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-base)] text-gray-700 placeholder-gray-400 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Repita a senha
                            </label>
                            <input
                                type="password"
                                placeholder="Digite sua nova senha novamente"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-base)] text-gray-700 placeholder-gray-400 transition"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                type="button"
                                to="/Senha"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 font-semibold text-[var(--color-base)] transition hover:bg-gray-50 sm:min-w-[7rem]"
                            >
                                <span>Voltar</span>
                                <Undo2 size={20} strokeWidth={2.2} />
                            </Link>
                            <Link
                                type="submit"
                                to="/Login"
                                className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--color-base)] px-6 text-base font-semibold text-white transition hover:bg-[var(--color-dark)] sm:min-w-[5.375rem]"
                            >
                                Alterar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Redefinir;
