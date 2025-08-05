import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, registrarDado } from "../utils/firebase";
import "../styles/registrarGlicemia.css";

const RegistrarGlicemia = () => {
  const navigate = useNavigate();

  const [glicemia, setGlicemia] = useState<string>("");
  const [tipoGlicemia, setTipoGlicemia] = useState<string>("");
  const [customTag, setCustomTag] = useState<string>("");
  const [observacao, setObservacao] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [editandoDataHora, setEditandoDataHora] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const agora = new Date();
    setDateTime(agora.toISOString().slice(0, 16)); // Formato: yyyy-MM-ddTHH:mm
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!glicemia || isNaN(Number(glicemia))) {
      setError("O valor inserido precisa ser um número válido.");
      return;
    }

    if (Number(glicemia) <= 20 || Number(glicemia) >= 800) {
      setError("Insira um valor válido maior que 20 e menor que 800.");
      return;
    }

    if (!tipoGlicemia) {
      setError("Selecione o tipo de glicemia.");
      return;
    }

    if (tipoGlicemia === "personalizada" && !customTag) {
      setError("Por favor, insira o nome da tag personalizada.");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError("Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      // Registrar a glicemia associada ao usuário logado
      await registrarDado(
        "glicemias",
        {
          valor: Number(glicemia),
          tipo: tipoGlicemia === "personalizada" ? customTag : tipoGlicemia,
          observacao: observacao || "Nenhuma observação.",
          dataHora: new Date(dateTime),
        },
        userId
      );

      setSuccess("Registro de glicemia realizado com sucesso!");
      setGlicemia("");
      setTipoGlicemia("");
      setCustomTag("");
      setObservacao("");
      setDateTime(new Date().toISOString().slice(0, 16));

      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Erro ao registrar glicemia:", err);
      setError("Erro ao registrar a glicemia. Tente novamente.");
    }
  };

  return (
    <div className="registrar-glicemia-container">
      <h1>Registrar glicemia</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form className="registrar-glicemia-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="glicemia">Valor da glicemia (mg/dL)</label>
          <input
            type="number"
            id="glicemia"
            placeholder="Ex.: 110"
            value={glicemia}
            onChange={(e) => setGlicemia(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoGlicemia">Tipo de glicemia</label>
          <select
            id="tipoGlicemia"
            value={tipoGlicemia}
            onChange={(e) => setTipoGlicemia(e.target.value)}
          >
            <option value="">Selecione o tipo</option>
            <option value="jejum">Em jejum</option>
            <option value="preAlmoco">Pré-almoço</option>
            <option value="posAlmoco">Pós-almoço</option>
            <option value="preJantar">Pré-jantar</option>
            <option value="posJantar">Pós-jantar</option>
            <option value="antesDormir">Antes de dormir</option>
            <option value="antesLanche">Antes do lanche</option>
            <option value="depoisLanche">Depois do lanche</option>
            <option value="antesAtividade">Antes de atividade física</option>
            <option value="duranteAtividade">Durante atividade física</option>
            <option value="aposAtividade">Após atividade física</option>
            <option value="personalizada">Tag personalizada</option>
          </select>
        </div>

        {tipoGlicemia === "personalizada" && (
          <div className="form-group">
            <label htmlFor="customTag">Nome da tag personalizada</label>
            <input
              type="text"
              id="customTag"
              placeholder="Insira o nome da tag"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="observacao">Observações</label>
          <textarea
            id="observacao"
            placeholder="Adicione observações opcionais"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateTime">Data e hora</label>
          <input
            type="datetime-local"
            id="dateTime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            disabled={!editandoDataHora}
          />
          {!editandoDataHora ? (
            <button
              type="button"
              onClick={() => setEditandoDataHora(true)}
              className="btn-small"
            >
              Editar data e hora
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditandoDataHora(false)}
              className="btn-small"
            >
              Concluir edição
            </button>
          )}
        </div>

        <button type="submit" className="btn">
          Registrar
        </button>
      </form>

      <button className="btn-back" onClick={() => navigate("/home")}>
        Voltar para a tela inicial
      </button>
    </div>
  );
};

export default RegistrarGlicemia;
