import LogoImg from "../assets/logo(1).svg";
import { Link } from "react-router-dom";
import Background from "../assets/BackgroundDesktop.svg";

function Cadastro() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={LogoImg} className="w-64 h-auto" alt="Escopo" />
        </div>
        <div className="flex justify-center mb-8">
          <img src={Background} className="w-1000 h-auto" alt="Background" />
        </div>
        <div className="rounded-[32px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900! mb-8">
            Cadastro
          </h1>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Nome
              </label>
              <input
                type="text"
                placeholder="Digite seu nome"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-gray-700 placeholder-gray-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-gray-700 placeholder-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-gray-700 placeholder-gray-400 transition"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                type="submit"
                className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                to="/Login"
              >
                Cadastre-se
              </Link>
            </div>
            <Link
              type="button"
              to="/Login"
              className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-[16px] text-purple-600 font-semibold hover:bg-gray-50 transition"
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
