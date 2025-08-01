import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, registrarDado } from "../utils/firebase";
import "../styles/dosesInsulina.css";

const DosesInsulina = () => {
  const [dose, setDose] = useState<string>("");
  const [tipoInsulina, setTipoInsulina] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [editandoHorario, setEditandoHorario] = useState<boolean>(false);
  const [mesmaDose, setMesmaDose] = useState<boolean>(false);
  const [frequencia, setFrequencia] = useState<string>("");
  const [dosagem, setDosagem] = useState<string>("");
  const [periodoPersonalizado, setPeriodoPersonalizado] = useState<boolean>(false);
  const [unidadeTempo, setUnidadeTempo] = useState<string>("");
  const [valorPeriodo, setValorPeriodo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const agora = new Date();
    const formattedDateTime = agora.toISOString().slice(0, 16); // Formato: YYYY-MM-DDTHH:MM
    setDateTime(formattedDateTime);
  }, []);

  const handleAdicionarDose = async () => {
    setError("");
    setSuccess("");

    if (!tipoInsulina || (!dose && !mesmaDose)) {
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
        "dosesInsulina",
        {
          dose: mesmaDose ? Number(dosagem) : Number(dose),
          tipoInsulina,
          observacoes: observacoes || "Nenhuma observação.",
          dateTime: new Date(dateTime).toISOString(),
          frequencia,
          periodoPersonalizado:
            frequencia === "personalizado"
              ? { unidadeTempo, valorPeriodo: Number(valorPeriodo) }
              : null,
        },
        userId
      );

      setSuccess("Dose de insulina registrada com sucesso!");
      setDose("");
      setTipoInsulina("");
      setObservacoes("");
      setDateTime(new Date().toISOString().slice(0, 16));
      setEditandoHorario(false);
      setMesmaDose(false);
      setDosagem("");
      setFrequencia("");
      setPeriodoPersonalizado(false);
      setUnidadeTempo("");
      setValorPeriodo("");

      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      console.error("Erro ao registrar a dose de insulina:", error);
      setError("Erro ao registrar a dose de insulina. Tente novamente.");
    }
  };

  return (
    <div className="doses-insulina-container">
      <h1>Registrar dose de insulina</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="form-group">
        <label htmlFor="tipoInsulina">Tipo de insulina</label>
        <select
          id="tipoInsulina"
          value={tipoInsulina}
          onChange={(e) => setTipoInsulina(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          <option value="Rápida">Rápida</option>
          <option value="Basal">Basal</option>
          <option value="Correção">Correção</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <div className="form-group switch-group">
        <label htmlFor="mesmaDose" className="switch-label">
          Você toma a mesma quantidade todos os dias?
        </label>
        <div className="switch">
          <input
            type="checkbox"
            id="mesmaDose"
            checked={mesmaDose}
            onChange={(e) => setMesmaDose(e.target.checked)}
          />
          <span className="slider"></span>
        </div>
      </div>

      {mesmaDose ? (
        <div className="form-group">
          <label htmlFor="dosagem">Dosagem:</label>
          <input
            type="number"
            id="dosagem"
            placeholder="Ex.: 10"
            value={dosagem}
            onChange={(e) => setDosagem(e.target.value)}
          />
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="dose">Quantidade de insulina (U)</label>
          <input
            type="number"
            id="dose"
            placeholder="Ex.: 10"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Com que frequência você toma essa medicação?</label>
        <select
          value={frequencia}
          onChange={(e) => {
            setFrequencia(e.target.value);
            setPeriodoPersonalizado(e.target.value === "personalizado");
          }}
        >
          <option value="">Selecione</option>
          <option value="1 vez por dia">1 vez por dia</option>
          <option value="2 vezes por dia">2 vezes por dia</option>
          <option value="3 vezes por dia">3 vezes por dia</option>
          <option value="4 vezes por dia">4 vezes por dia</option>
          <option value="5 vezes por dia">5 vezes por dia</option>
          <option value="personalizado">Período personalizado</option>
        </select>
      </div>

      {periodoPersonalizado && (
        <>
          <div className="form-group">
            <label>Unidade de tempo:</label>
            <select
              value={unidadeTempo}
              onChange={(e) => setUnidadeTempo(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="dias">Dias</option>
              <option value="semanas">Semanas</option>
              <option value="meses">Meses</option>
            </select>
          </div>
          <div className="form-group">
            <label>Valor:</label>
            <input
              type="number"
              placeholder="Ex.: 2"
              value={valorPeriodo}
              onChange={(e) => setValorPeriodo(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="dateTime">
          {editandoHorario ? "Editar dia e hora da dose" : "Dia e hora da dose"}
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

      <div className="form-group">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          id="observacoes"
          placeholder="Adicione observações opcionais"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        ></textarea>
      </div>

      <button className="btn-add" onClick={handleAdicionarDose}>
        Adicionar dose
      </button>

      <button className="btn-back" onClick={() => navigate("/home")}>
        Voltar para tela inicial
      </button>
    </div>
  );
};

export default DosesInsulina;
