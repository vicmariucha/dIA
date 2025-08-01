import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import "../styles/medico.css";

type Paciente = {
  id: string;
  nome: string;
  email: string;
};

const Medico = () => {
  const navigate = useNavigate();
  const [medicoNome, setMedicoNome] = useState<string>("Carregando...");
  const [pacientes, setPacientes] = useState<Paciente[]>([
    { id: "1", nome: "Victória Mariucha", email: "vicmariucha@gmail.com" },
    { id: "2", nome: "Maria Oliveira", email: "maoliveira@gmail.com" },
    { id: "3", nome: "Felipe Souza", email: "anaasouza@gmail.com" },
  ]);
  const [pacienteIdParaAssociar, setPacienteIdParaAssociar] = useState<string>("");
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [statusAssociacao, setStatusAssociacao] = useState<string>("");

  useEffect(() => {
    const carregarNomeMedico = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setMedicoNome("Usuário não autenticado");
          return;
        }

        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const nomeCompleto = userData.nome || "Nome não encontrado";
          const doisPrimeirosNomes = nomeCompleto.split(" ").slice(0, 2).join(" ");
          setMedicoNome(doisPrimeirosNomes);
        } else {
          setMedicoNome("Nome não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar o nome do médico:", error);
        setMedicoNome("Erro ao carregar nome");
      }
    };

    carregarNomeMedico();
  }, []);

  const enviarPedidoAssociacao = () => {
    if (!pacienteIdParaAssociar) {
      setStatusAssociacao("Erro: ID ou email do paciente está vazio.");
      return;
    }

    const pacienteEncontrado = pacientes.find(
      (paciente) => paciente.email === pacienteIdParaAssociar
    );

    if (!pacienteEncontrado) {
      setStatusAssociacao("Paciente não encontrado.");
      return;
    }

    setStatusAssociacao("Pedido de associação enviado com sucesso!");
    setPacienteIdParaAssociar("");
  };

  const enviarFeedback = () => {
    if (!selectedPaciente) {
      alert("Selecione um paciente para enviar o feedback.");
      return;
    }

    if (feedback.trim() === "") {
      alert("O feedback não pode estar vazio.");
      return;
    }

    alert(`Feedback enviado para ${selectedPaciente.nome}.`);
    setFeedback("");
  };

  return (
    <div className="medico-container">
      <header className="medico-header">
        <h1>Bem-vindo, {medicoNome}</h1>
        <button className="btn-perfil" onClick={() => navigate("/perfil")}>
          Perfil
        </button>
      </header>

      <section className="associar-pacientes-section">
        <h2>Associar paciente</h2>
        <input
          type="text"
          placeholder="Digite o email do paciente"
          value={pacienteIdParaAssociar}
          onChange={(e) => setPacienteIdParaAssociar(e.target.value)}
        />
        <button className="btn-associar" onClick={enviarPedidoAssociacao}>
          Enviar pedido de associação
        </button>
        {statusAssociacao && <p className="status">{statusAssociacao}</p>}
      </section>

      <section className="pacientes-section">
        <h2>Meus pacientes</h2>
        {pacientes.length === 0 ? (
          <p>Nenhum paciente associado encontrado.</p>
        ) : (
          <div className="pacientes-container">
            {pacientes.map((paciente) => (
              <div
                key={paciente.id}
                className={`paciente-card ${
                  selectedPaciente?.id === paciente.id ? "selected" : ""
                }`}
                onClick={() => setSelectedPaciente(paciente)}
              >
                <h3>{paciente.nome}</h3>
                <p>{paciente.email}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedPaciente && (
        <section className="paciente-detalhes">
          <h2>Dados do paciente</h2>
          <p>
            <strong>Nome:</strong> {selectedPaciente.nome}
          </p>
          <p>
            <strong>Email:</strong> {selectedPaciente.email}
          </p>

          <h3>Solicitar dados</h3>
          <div className="solicitacoes-container">
            <button className="btn-solicitar">Pedir histórico de glicemia</button>
            <button className="btn-solicitar">Pedir histórico de insulina</button>
            <button className="btn-solicitar">Pedir histórico de alimentação</button>
            <button className="btn-solicitar">Pedir histórico de atividades físicas</button>
          </div>

          <div className="feedback-container">
            <h3>Enviar feedback</h3>
            <textarea
              className="feedback-input"
              placeholder="Escreva sua orientação ou correção aqui..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <button className="btn-feedback" onClick={enviarFeedback}>
              Enviar feedback
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Medico;
