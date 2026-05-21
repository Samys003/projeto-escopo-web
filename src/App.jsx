import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Cadastro from './pages/login/Cadastro';
import Senha from './pages/login/Senha';
import Redefinir from './pages/login/Redefinir';
import Dashboard from './pages/dashboard/Dashboard';
import Configuracao from './pages/configuracao/configuracao';
import ProjectDetails from './pages/project-details/ProjectDetails';

import NewProject from './pages/new-project/NewProject';
import ProjectList from './pages/project-list/ProjectList';
import DetailsMeeting from './pages/detailsMeeting/DetailsMeeting';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/projeto/:id" element={<ProjectDetails />} />
                <Route path="/reuniao/:id" element={<DetailsMeeting />} />
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/Senha" element={<Senha />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Redefinir" element={<Redefinir />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/novo-projeto" element={<NewProject />} />
                <Route path="/projetos" element={<ProjectList />} />
                <Route path="/configuracao" element={<Configuracao />} />
            </Routes>
        </Router>
    );
}

export default App;
