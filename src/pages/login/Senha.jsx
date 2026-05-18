import LogoImg from '../../assets/logotipo-desktop.svg';
import { Link } from 'react-router-dom';
import { Undo2 } from 'lucide-react';

function Senha() {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-5 py-8 sm:px-6 lg:px-10 lg:py-12"
            style={{ backgroundImage: 'var(--login-background)' }}
        >
            <div className="w-full max-w-[30.25rem]">
                <div className="mb-8 flex justify-center lg:mb-14">
                    <img
                        src={LogoImg}
                        className="h-auto w-[clamp(12rem,23vw,21rem)] max-w-full"
                        alt="Escopo"
                    />
                </div>

                <div className="rounded-[2.25rem] bg-white p-6 shadow-[var(--external-shadow)] sm:p-8 lg:px-[3.625rem] lg:py-11">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                        Redefinir Senha
                    </h1>

                    <p className="mb-5 text-center text-sm leading-6 text-black">
                        Você receberá um código de verificação em seu e-mail
                    </p>

                    <form className="space-y-5">
                        <div>
                            <label className="mb-2 block font-medium text-gray-800">E-mail</label>
                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-700 transition placeholder:text-gray-400 focus:border-[#552ba9] focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(8.5rem,1fr)_minmax(6.25rem,0.75fr)]">
                            <button
                                type="button"
                                className="h-11 rounded-lg bg-[#552ba9] px-4 font-semibold text-white transition hover:bg-[#42257c]"
                            >
                                Enviar Código
                            </button>
                            <button
                                type="button"
                                className="h-11 rounded-lg bg-purple-300 px-4 font-semibold text-white transition hover:bg-[#7645d787]"
                            >
                                Reenviar
                            </button>
                        </div>

                        <div className="flex justify-center gap-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="h-10 w-10 rounded-none border border-black text-center text-xl font-semibold text-black focus:border-[#552ba9] focus:outline-none"
                                />
                            ))}
                        </div>

                        <div className="flex flex-col-reverse gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                type="button"
                                to="/Login"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 font-semibold text-[#552ba9] transition hover:bg-gray-50 sm:min-w-[7rem]"
                            >
                                <span>Voltar</span>
                                <Undo2 size={20} strokeWidth={2.2} />
                            </Link>
                            <Link
                                type="submit"
                                to="/Redefinir"
                                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#552ba9] px-6 text-base font-semibold text-white transition hover:bg-[#42257c] sm:min-w-[6.75rem]"
                            >
                                Confirmar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Senha;
