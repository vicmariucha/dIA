import React, { useState, useEffect } from "react";
import { auth, registrarDado } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/registroAlimentos.css";

const RegistroAlimentos = () => {
  const [alimento, setAlimento] = useState("");
  const [carboidratos, setCarboidratos] = useState("");
  const [calorias, setCalorias] = useState("");
  const [gordura, setGordura] = useState("");
  const [proteina, setProteina] = useState("");
  const [tipoRefeicao, setTipoRefeicao] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [editandoDataHora, setEditandoDataHora] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    setDateTime(now.toISOString().slice(0, 16)); // Formato: yyyy-MM-ddTHH:mm
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!alimento || !carboidratos || (!tipoRefeicao && !customTag)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError("Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      await registrarDado(
        "alimentos",
        {
          alimento,
          carboidratos: Number(carboidratos),
          calorias: calorias ? Number(calorias) : null,
          gordura: gordura ? Number(gordura) : null,
          proteina: proteina ? Number(proteina) : null,
          tipoRefeicao: tipoRefeicao === "personalizada" ? customTag : tipoRefeicao,
          observacoes,
          dateTime: new Date(dateTime),
        },
        userId
      );

      setSuccess("Refeição adicionada com sucesso!");
      setAlimento("");
      setCarboidratos("");
      setCalorias("");
      setGordura("");
      setProteina("");
      setTipoRefeicao("");
      setCustomTag("");
      setObservacoes("");
      setEditandoDataHora(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Erro ao adicionar a refeição: " + err.message);
      } else {
        setError("Erro ao adicionar a refeição.");
      }
    }
  };

  return (
    <div className="registro-alimentos-container">
      <h1>Registrar refeição</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="alimento">Nome do alimento</label>
          <input
            type="text"
            id="alimento"
            value={alimento}
            onChange={(e) => setAlimento(e.target.value)}
            placeholder="Ex.: Arroz, Maçã"
            required
          />
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="carboidratos">Carboidratos (g)</label>
            <input
              type="number"
              id="carboidratos"
              className="small-input"
              value={carboidratos}
              onChange={(e) => setCarboidratos(e.target.value)}
              placeholder="Ex.: 25"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="calorias">Calorias (kcal)</label>
            <input
              type="number"
              id="calorias"
              className="small-input"
              value={calorias}
              onChange={(e) => setCalorias(e.target.value)}
              placeholder="Ex.: 200"
            />
          </div>
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="gordura">Gordura (g)</label>
            <input
              type="number"
              id="gordura"
              className="small-input"
              value={gordura}
              onChange={(e) => setGordura(e.target.value)}
              placeholder="Ex.: 10"
            />
          </div>
          <div className="form-group">
            <label htmlFor="proteina">Proteína (g)</label>
            <input
              type="number"
              id="proteina"
              className="small-input"
              value={proteina}
              onChange={(e) => setProteina(e.target.value)}
              placeholder="Ex.: 15"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="tipoRefeicao">Tipo de refeição</label>
          <select
            id="tipoRefeicao"
            value={tipoRefeicao}
            onChange={(e) => setTipoRefeicao(e.target.value)}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="cafeManha">Café da manhã</option>
            <option value="lancheManha">Lanche da manhã</option>
            <option value="almoco">Almoço</option>
            <option value="lancheTarde">Lanche da tarde</option>
            <option value="jantar">Jantar</option>
            <option value="lancheNoite">Lanche da noite</option>
            <option value="ceia">Ceia</option>
            <option value="personalizada">Adicionar tag personalizada</option>
          </select>
        </div>
        {tipoRefeicao === "personalizada" && (
          <div className="form-group">
            <label htmlFor="customTag">Tag personalizada</label>
            <input
              type="text"
              id="customTag"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Ex.: Pós-Treino"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Adicione alguma observação opcional"
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
        <button type="submit" className="btn">Adicionar refeição</button>
      </form>
      <button className="btn-back" onClick={() => navigate("/home")}>Voltar para tela inicial</button>
    </div>
  );
};

export default RegistroAlimentos;
