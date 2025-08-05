import { useState, useEffect } from "react";
import { auth, registrarDado } from "../utils/firebase";
import "../styles/atividadeFisica.css";
import { useNavigate } from "react-router-dom";

const AtividadeFisica = () => {
  const [titulo, setTitulo] = useState("");
  const [duracao, setDuracao] = useState("00:00"); // Duração no formato HH:MM
  const [gastoCalorico, setGastoCalorico] = useState(""); // Gasto calórico em calorias
  const [observacoes, setObservacoes] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [editandoHorario, setEditandoHorario] = useState(false);
  const [editandoDuracao, setEditandoDuracao] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const agora = new Date();
    const formattedDateTime = agora.toISOString().slice(0, 16); // Formato: YYYY-MM-DDTHH:MM
    setDateTime(formattedDateTime);
  }, []);

  const handleAdicionarAtividade = async () => {
    setError(null);
    setSuccess(null);

    if (!titulo || !duracao || !gastoCalorico) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError("Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      await registrarDado(
        "atividadesFisicas",
        {
          titulo,
          duracao, // Duração no formato HH:MM
          gastoCalorico: parseFloat(gastoCalorico), // Gasto calórico convertido para número
          observacoes: observacoes || "Nenhuma observação.",
          dateTime: new Date(dateTime).toISOString(),
        },
        userId
      );

      setSuccess("Atividade física registrada com sucesso!");

      // Reseta os campos após o registro
      setTitulo("");
      setDuracao("00:00");
      setGastoCalorico("");
      setObservacoes("");
      setDateTime(new Date().toISOString().slice(0, 16));
      setEditandoHorario(false);
      setEditandoDuracao(false);

      // Redireciona para a tela inicial após 2 segundos
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      console.error("Erro ao registrar a atividade física:", error);
      setError("Erro ao registrar a atividade física. Tente novamente.");
    }
  };

  return (
    <div className="atividade-fisica-container">
      <h1>Registrar atividade física</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="form-group">
        <label htmlFor="titulo">Título da atividade</label>
        <input
          type="text"
          id="titulo"
          placeholder="Ex.: Caminhada, Corrida, Yoga"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="duracao">Duração da atividade (HH:MM)</label>
        <input
          type="time"
          id="duracao"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          disabled={!editandoDuracao}
        />
        {!editandoDuracao ? (
          <button
            className="btn-edit"
            onClick={() => setEditandoDuracao(true)}
          >
            Editar duração
          </button>
        ) : (
          <button
            className="btn-save"
            onClick={() => setEditandoDuracao(false)}
          >
            Salvar duração
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="gastoCalorico">Gasto de energia (calorias)</label>
        <input
          type="number"
          id="gastoCalorico"
          placeholder="Ex.: 200"
          value={gastoCalorico}
          onChange={(e) => setGastoCalorico(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          id="observacoes"
          placeholder="Adicione observações opcionais"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="dateTime">
          {editandoHorario ? "Editar dia e hora da atividade" : "Dia e hora da atividade"}
        </label>
        <input
          type="datetime-local"
          id="dateTime"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          disabled={!editandoHorario}
        />
        {!editandoHorario ? (
          <button
            className="btn-edit"
            onClick={() => setEditandoHorario(true)}
          >
            Editar horário
          </button>
        ) : (
          <button
            className="btn-save"
            onClick={() => setEditandoHorario(false)}
          >
            Salvar horário
          </button>
        )}
      </div>

      <button className="btn-add" onClick={handleAdicionarAtividade}>
        Adicionar atividade
      </button>

      <button className="btn-back" onClick={() => navigate("/home")}>
        Voltar para a tela inicial
      </button>
    </div>
  );
};

export default AtividadeFisica;
