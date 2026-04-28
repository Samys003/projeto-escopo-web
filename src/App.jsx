import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Senha from "./pages/Senha";
import Redefinir from "./pages/Redefinir";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/Senha" element={<Senha />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Redefinir" element={<Redefinir />} />
      </Routes>
    </Router>
  );
}

export default App;
