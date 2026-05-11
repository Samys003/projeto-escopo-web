import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Cadastro from './pages/login/Cadastro';
import Senha from './pages/login/Senha';
import Redefinir from './pages/login/Redefinir';
import Dashboard from './pages/dashboard/Dashboard';
import Configuracao from './pages/configuracao/configuracao';
import NewProject from './pages/new-project/NewProject';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/Senha" element={<Senha />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Redefinir" element={<Redefinir />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/novo-projeto" element={<NewProject />} />
                <Route path="/configuracao" element={<Configuracao />} />

            </Routes>
        </Router>
    );
}

export default App;
