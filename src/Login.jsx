import LogoImg from "./assets/logo(1).svg";
import Cadastro from "./cadastro";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={LogoImg} className="w-64 h-auto" alt="Escopo" />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
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
            <a
              href="#"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium transition"
            >
              Esqueceu a senha?
            </a>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="flex-1 py-3 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition"
              link="/cadastro"
            >
              Cadastre-se
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
