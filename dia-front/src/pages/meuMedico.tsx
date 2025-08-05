import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/meuMedico.css";

// Tipos para mensagens e médicos
type Mensagem = {
  id: string;
  remetente: "Você" | "Médico";
  conteudo: string;
  timestamp: Date;
};

type Medico = {
  id: string;
  nome?: string;
  crm?: string;
  especialidade?: string;
  email?: string;
};

const MeuMedico = () => {
  const navigate = useNavigate();
  const [medico, setMedico] = useState<Medico | null>({
    id: "1",
    nome: "Dr. Gustavo Argoze",
    crm: "12345-SP",
    especialidade: "Endocrinologia",
    email: "gustavoargozelopes@gmail.com",
  });
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: "1",
      remetente: "Médico",
      conteudo: "Olá, como está sua glicemia hoje?",
      timestamp: new Date(new Date().setHours(8, 0)),
    },
    {
      id: "2",
      remetente: "Você",
      conteudo: "Está controlada, doutor. Última leitura foi 110 mg/dL.",
      timestamp: new Date(new Date().setHours(8, 15)),
    },
    {
      id: "3",
      remetente: "Médico",
      conteudo: "Ótimo! Continue assim. Não se esqueça de registrar suas refeições.",
      timestamp: new Date(new Date().setHours(8, 30)),
    },
  ]);
  const [novaMensagem, setNovaMensagem] = useState("");

  const enviarMensagem = () => {
    if (novaMensagem.trim() === "") {
      alert("A mensagem não pode estar vazia.");
      return;
    }

    const novaMensagemObj = {
      id: Date.now().toString(),
      remetente: "Paciente",
      conteudo: novaMensagem,
      timestamp: new Date(),
    };
    setMensagens((prev) => [...prev, novaMensagemObj]);
    setNovaMensagem("");
  };

  const enviarDados = () => {
    navigate("/compartilharDados");
  };

  return (
    <div className="meu-medico-container">
      {/* Informações do médico */}
      <div className="info-container">
        <h2>Informações do Médico</h2>
        {medico ? (
          <div className="perfil-medico">
            <p><strong>Nome:</strong> {medico.nome || "Não informado"}</p>
            <p><strong>CRM:</strong> {medico.crm || "Não informado"}</p>
            <p><strong>Especialidade:</strong> {medico.especialidade || "Não informado"}</p>
            <p><strong>Email:</strong> {medico.email || "Não informado"}</p>
          </div>
        ) : (
          <p>Nenhum médico associado encontrado.</p>
        )}
        <button className="btn-dados" onClick={enviarDados}>
          Enviar meus dados
        </button>
        <button className="btn-back" onClick={() => window.history.back()}>
          Voltar à página inicial
        </button>
      </div>

      {/* Chat entre médico e paciente */}
      <div className="chat-container">
        <h2>Fale com o seu Médico</h2>
        <div className="mensagens-container">
          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`mensagem ${mensagem.remetente === "Paciente" ? "paciente" : "medico"}`}
            >
              <p className="remetente">{mensagem.remetente}:</p>
              <p>{mensagem.conteudo}</p>
              <small>{new Date(mensagem.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <textarea
          className="input-mensagem"
          placeholder="Digite sua mensagem"
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
        />
        <button className="btn-enviar" onClick={enviarMensagem}>
          Enviar mensagem
        </button>
      </div>
    </div>
  );
};

export default MeuMedico;
