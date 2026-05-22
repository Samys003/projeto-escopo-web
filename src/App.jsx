import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Cadastro from './pages/login/Cadastro';
import Senha from './pages/login/Senha';
import Redefinir from './pages/login/Redefinir';
import Dashboard from './pages/dashboard/Dashboard';
import Configuracao from './pages/configuracao/configuracao';
import Documento from './pages/documento/documento'; // DELETAR, PROVISÓRIO

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/senha" element={<Senha />} />
                <Route path="/login" element={<Login />} />
                <Route path="/redefinir" element={<Redefinir />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/configuracao" element={<Configuracao />} />
                <Route path="/documento/:documentoId" element={<Documento />} />
                <Route path="/documento" element={<Documento />} /> {/* DELETAR, PROVISÓRIO */}
            </Routes>
        </Router>
    );
}

export default App;
