import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/bolus.css";

const CalcularBolus = () => {
  const navigate = useNavigate();
  const [carboidratos, setCarboidratos] = useState<string>("");
  const [glicemiaAtual, setGlicemiaAtual] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resultado, setResultado] = useState<string>("");

  const calcularBolus = () => {
    setErrorMessage("");
    setResultado("");

    const ICR = 15; // Razão insulina-carboidrato
    const glicemiaAlvo = 100; // Glicemia alvo (mg/dL)
    const fatorSensibilidade = 50; // Quanto 1U reduz na glicemia

    // Validações
    if (!carboidratos || isNaN(Number(carboidratos)) || Number(carboidratos) <= 0) {
      setErrorMessage("Insira um valor válido para os carboidratos.");
      return;
    }
    if (!glicemiaAtual || isNaN(Number(glicemiaAtual)) || Number(glicemiaAtual) <= 0) {
      setErrorMessage("Insira um valor válido para a glicemia atual.");
      return;
    }

    // Cálculos
    const bolusAlimentar = Number(carboidratos) / ICR;
    const bolusCorrecao = (Number(glicemiaAtual) - glicemiaAlvo) / fatorSensibilidade;
    const bolusTotal = Math.max(bolusAlimentar + bolusCorrecao, 0);

    setResultado(`Dose de insulina recomendada: ${bolusTotal.toFixed(1)}U`);
  };

  return (
    <div className="bolus-container">
      <h1>Calculadora de bolus</h1>

      <div className="form-group">
        <label htmlFor="carboidratos">Quantidade de carboidratos (g):</label>
        <input
          id="carboidratos"
          type="number"
          placeholder="Ex.: 30"
          value={carboidratos}
          onChange={(e) => setCarboidratos(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="glicemiaAtual">Glicemia atual (mg/dL):</label>
        <input
          id="glicemiaAtual"
          type="number"
          placeholder="Ex.: 150"
          value={glicemiaAtual}
          onChange={(e) => setGlicemiaAtual(e.target.value)}
        />
      </div>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <button className="btn" onClick={calcularBolus}>
        Calcular bolus
      </button>

      {resultado && <p className="result-text">{resultado}</p>}

      <button className="btn-back" onClick={() => navigate("/home")}>Voltar para página inicial</button>
    </div>
  );
};

export default CalcularBolus;
