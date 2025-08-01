import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/compartilharDados.css";

type DadosSelecionados = {
  glicemias: boolean;
  bolus: boolean;
  historicoCompleto: boolean;
};

const CompartilharDados = () => {
  const navigate = useNavigate();
  const [dadosSelecionados, setDadosSelecionados] = useState<DadosSelecionados>({
    glicemias: false,
    bolus: false,
    historicoCompleto: false,
  });
  const [periodo, setPeriodo] = useState<string>("2 semanas");
  const [periodoPersonalizado, setPeriodoPersonalizado] = useState<boolean>(false);
  const [personalizadoTipo, setPersonalizadoTipo] = useState<string>("");
  const [personalizadoValor, setPersonalizadoValor] = useState<string>("");

  const toggleDado = (key: keyof DadosSelecionados) => {
    setDadosSelecionados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const enviarDados = () => {
    let periodoFinal = periodo;

    if (periodo === "Período personalizado") {
      if (!personalizadoTipo || !personalizadoValor) {
        alert("Preencha os campos do período personalizado.");
        return;
      }
      periodoFinal = `${personalizadoValor} ${personalizadoTipo}`;
    }

    const dadosSelecionadosArray = Object.keys(dadosSelecionados).filter(
      (key) => dadosSelecionados[key as keyof DadosSelecionados]
    );

    if (dadosSelecionadosArray.length === 0) {
      alert("Selecione ao menos um tipo de dado para enviar.");
      return;
    }

    alert(
      `Dados selecionados: ${dadosSelecionadosArray.join(", ")}\nPeríodo: ${periodoFinal}`
    );
    console.log(`Enviar dados: ${dadosSelecionadosArray} no período: ${periodoFinal}`);
  };

  return (
    <div className="compartilhar-dados-container">
      <div className="content">
        <h1>Compartilhar dados com o médico</h1>

        <div className="section">
          <h2>Selecionar dados para enviar</h2>
          <div className="checkbox-container">
            {Object.keys(dadosSelecionados).map((key) => (
              <label key={key} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={dadosSelecionados[key as keyof DadosSelecionados]}
                  onChange={() => toggleDado(key as keyof DadosSelecionados)}
                />
                {key === "glicemias" && "Glicemias"}
                {key === "bolus" && "Bolus de insulina"}
                {key === "historicoCompleto" && "Histórico completo"}
              </label>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Selecionar período</h2>
          <select
            value={periodo}
            onChange={(e) => {
              setPeriodo(e.target.value);
              setPeriodoPersonalizado(e.target.value === "Período personalizado");
            }}
            className="select"
          >
            <option value="2 semanas">2 semanas</option>
            <option value="1 mês">1 mês</option>
            <option value="3 meses">3 meses</option>
            <option value="Período personalizado">Período personalizado</option>
          </select>

          {periodoPersonalizado && (
            <div className="personalizado-container">
              <input
                type="number"
                placeholder="Valor (ex.: 6)"
                value={personalizadoValor}
                onChange={(e) => setPersonalizadoValor(e.target.value)}
                className="small-input"
              />
              <select
                value={personalizadoTipo}
                onChange={(e) => setPersonalizadoTipo(e.target.value)}
                className="select small-select"
              >
                <option value="">Selecione</option>
                <option value="dias">Dias</option>
                <option value="semanas">Semanas</option>
                <option value="meses">Meses</option>
                <option value="anos">Anos</option>
              </select>
            </div>
          )}
        </div>

        <div className="button-container">
          <button className="btn" onClick={enviarDados}>
            Enviar dados
          </button>
          <button className="btn-back" onClick={() => navigate("/home")}>
            Voltar para página inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompartilharDados;
