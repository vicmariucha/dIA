import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Bolus from "./pages/bolus";
import RegistrarGlicemia from "./pages/registrarGlicemia";
import Historico from "./pages/historico";
import Recomendacoes from "./pages/recomendacoes";
import Perfil from "./pages/perfil";
import Notificacoes from "./pages/notificacoes";
import Registro from "./pages/registro";
import RegistroAlimentos from "./pages/registroAlimentos";
import DosesInsulina from "./pages/dosesInsulina";
import AtividadeFisica from "./pages/atividadeFisica";
import MeuMedico from "./pages/meuMedico";
import CompartilharDados from "./pages/compartilharDados";
import Medico from "./pages/medico";
import RecuperarSenha from "./pages/recuperarSenha";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<Login />} />

        {/* Rotas principais */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bolus" element={<Bolus />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/registrarGlicemia" element={<RegistrarGlicemia />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/recomendacoes" element={<Recomendacoes />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/registroAlimentos" element={<RegistroAlimentos />} />
        <Route path="/dosesInsulina" element={<DosesInsulina />} />
        <Route path="/atividadeFisica" element={<AtividadeFisica />} />
        <Route path="/meuMedico" element={<MeuMedico />} />
        <Route path="/compartilharDados" element={<CompartilharDados />} />
        <Route path="/medico" element={<Medico />} />
        <Route path="/recuperarSenha" element={<RecuperarSenha />} />

      </Routes>
    </Router>
  );
};

export default App;
