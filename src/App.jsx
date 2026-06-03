import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Cadastro from './pages/login/Cadastro';
import Senha from './pages/login/Senha';
import Redefinir from './pages/login/Redefinir';
import Dashboard from './pages/dashboard/Dashboard';
import Configuracao from './pages/configuracao/configuracao';
import ProjectDetails from './pages/project-details/ProjectDetails';
import NewProject from './pages/new-project/NewProject';
import EditProject from './pages/new-project/EditProject';
import ProjectList from './pages/project-list/ProjectList';
import DetailsMeeting from './pages/detailsMeeting/DetailsMeeting';
import Documento from './pages/documento/documento';
import Registro from './pages/registro/registro';
import Notificacoes from './pages/notificacoes/notificacoes';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/projeto/:id" element={<ProjectDetails />} />
                <Route path="/reuniao/:id" element={<DetailsMeeting />} />
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/senha" element={<Senha />} />
                <Route path="/login" element={<Login />} />
                <Route path="/redefinir" element={<Redefinir />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/novo-projeto" element={<NewProject />} />
                <Route path="/projeto/:projetoId/editar-projeto/" element={<EditProject />} />
                <Route path="/projetos" element={<ProjectList />} />
                <Route path="/configuracao" element={<Configuracao />} />
                <Route path="/documento/:documentoId" element={<Documento />} />
                <Route path="/documento" element={<Documento />} />
                <Route path="/registro/:registroId" element={<Registro />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/notificacoes" element={<Notificacoes />} />
            </Routes>
        </Router>
    );
}

export default App;
