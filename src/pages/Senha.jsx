import LogoImg from "../assets/logo(1).svg";
import { Link } from "react-router-dom";

function Senha() {
  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={LogoImg} className="w-64 h-auto" alt="Escopo" />
        </div>

        <div className="rounded-[32px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-center text-black! mb-4">
            Redefinir Senha
          </h1>

          <p className="text-center text-sm text-gray-600 mb-6 leading-6">
            Você receberá um código de verificação em seu e-mail
          </p>

          <form className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Digite seu email"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-[24px] focus:outline-none focus:border-purple-600 text-gray-700 placeholder:text-gray-400 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full py-3 rounded-[16px] bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              >
                Enviar Código
              </button>
              <button
                type="button"
                className="w-full py-3 rounded-[16px] bg-purple-200 text-purple-900 font-semibold hover:bg-purple-300 transition"
              >
                Reenviar
              </button>
            </div>

            <div className="flex justify-center gap-2 ">
              {Array.from({ length: 5 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-14  h-14 text-center text-xl font-semibold border-2 border-black rounded-xl focus:border-purple-600 focus:outline-none"
                />
              ))}
            </div>

            <Link
              type="submit"
              to="/Redefinir"
              className="w-full py-3 mt-2 rounded-[16px] bg-purple-600 text-white text-base font-semibold hover:bg-purple-700 transition"
            >
              Confirmar
            </Link>
          </form>
        </div>

        <Link
          type="button"
          to="/Login"
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-[16px] text-purple-600 font-semibold hover:bg-gray-50 transition"
        >
          <span>Voltar</span>
          <span className="text-xl">↩︎</span>
        </Link>
      </div>
    </div>
  );
}

export default Senha;
