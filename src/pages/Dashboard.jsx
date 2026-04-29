// DASHBOARD APENAS PARA TESTAR O LOGIN -- DELETE PELA VERSÃO FINAL DEPOIS
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f6ff] px-6 py-12">
      <div className="w-full max-w-2xl rounded-4xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Dashboard
        </h1>
        {user ? (
          <p className="text-center text-gray-700 mb-6">
            Bem-vindo, <strong>{user.nome}</strong>!
          </p>
        ) : (
          <p className="text-center text-gray-700 mb-6">Usuário autenticado.</p>
        )}

        <div className="space-y-4 text-center">
          <p className="text-gray-600"></p>
          <Link
            to="/Login"
            className="inline-flex items-center justify-center rounded-xl border border-[#552ba9] bg-[#552ba9] px-6 py-3 text-sm font-semibold text-white hover:bg-[#42257c] transition"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
