import { Link } from "react-router-dom";
import LogoImg from "../assets/logo(1).svg";
import Carrossel from "../components/carrossel";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            src={LogoImg}
            className="w-32 md:w-44 lg:w-64 h-auto"
            alt="Escopo"
          />
        </div>
        <div className="rounded-4xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900! mb-8">
            Login
          </h1>

          <form className="space-y-6">
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

            <div className="text-right">
              <Link
                to="/Senha"
                href="/Senha"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium transition"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Link
                to="/cadastro"
                className="flex-1 py-3 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition text-center"
              >
                Cadastre-se
              </Link>
              <Link
                type="submit"
                to="/Dashboard"
                className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
              >
                Entrar
              </Link>
            </div>
          </form>
        </div>

        <Carrossel />
      </div>
    </div>
  );
}

export default Login;
