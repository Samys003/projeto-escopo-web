import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./Login.jsx";
import Cadastro from "./cadastro.jsx";
import Senha from "./Senha.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Login />
    <Cadastro />
    <Senha />
  </StrictMode>,
);
