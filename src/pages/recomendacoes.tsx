import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/recomendacoes.css";

const Recomendacoes = () => {
  const navigate = useNavigate();
  const [glicemia, setGlicemia] = useState<number | "">("");
  const [tipoDose, setTipoDose] = useState<"refeicao" | "correcao" | "">("");
  const [carboidratos, setCarboidratos] = useState<number | "">("");
  const [atividadeFisica, setAtividadeFisica] = useState<
    "jaPraticou" | "vaiPraticar" | "naoPraticou" | ""
  >("");
  const [recomendacao, setRecomendacao] = useState<string>("");
  const [erro, setErro] = useState<string>("");

  const analisarDose = async () => {
    // Limpar mensagens anteriores
    setRecomendacao("");
    setErro("");

    // Validação dos campos
    if (!glicemia || !tipoDose || (tipoDose === "refeicao" && !carboidratos)) {
      alert("Por favor, preencha todas as informações necessárias.");
      return;
    }

    const dados = {
      glicemia_atual: glicemia,
      tipo_dose: tipoDose,
      carboidratos: tipoDose === "refeicao" ? carboidratos : 0,
      atividade_fisica: atividadeFisica,
    };

    try {
      const resposta = await fetch("http://127.0.0.1:5000/recomendacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        setRecomendacao(
          `Dose recomendada: ${resultado.dose_recomendada} unidades de insulina.`
        );
      } else {
        setErro(resultado.error || "Erro ao calcular a dose. Tente novamente.");
      }
    } catch (erro) {
      console.error("Erro ao conectar ao servidor:", erro);
      setErro("Erro ao conectar ao servidor. Verifique sua conexão.");
    }
  };

  return (
    <div className="recomendacoes-container">
      <h1>Recomendações de dose de insulina</h1>

      <div className="input-container">
        <label htmlFor="glicemia">Glicemia atual (mg/dL):</label>
        <input
          id="glicemia"
          type="number"
          value={glicemia}
          onChange={(e) => setGlicemia(Number(e.target.value))}
          placeholder="Ex.: 110"
        />
      </div>

      <div className="input-container">
        <label>Tipo de dose:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="tipoDose"
              value="refeicao"
              checked={tipoDose === "refeicao"}
              onChange={() => setTipoDose("refeicao")}
            />
            Para refeição
          </label>
          <label>
            <input
              type="radio"
              name="tipoDose"
              value="correcao"
              checked={tipoDose === "correcao"}
              onChange={() => setTipoDose("correcao")}
            />
            Para correção
          </label>
        </div>
      </div>

      {tipoDose === "refeicao" && (
        <div className="input-container">
          <label htmlFor="carboidratos">Carboidratos a serem ingeridos (g):</label>
          <input
            id="carboidratos"
            type="number"
            value={carboidratos}
            onChange={(e) => setCarboidratos(Number(e.target.value))}
            placeholder="Ex.: 45"
          />
        </div>
      )}

      <div className="input-container">
        <label>Atividade física:</label>
        <select
          value={atividadeFisica}
          onChange={(e) =>
            setAtividadeFisica(
              e.target.value as "jaPraticou" | "vaiPraticar" | "naoPraticou"
            )
          }
        >
          <option value="" disabled hidden>
            Selecione
          </option>
          <option value="jaPraticou">Já pratiquei hoje</option>
          <option value="vaiPraticar">Ainda vou praticar</option>
          <option value="naoPraticou">Não pratiquei hoje</option>
        </select>
      </div>

      <button className="btn-analisar" onClick={analisarDose}>
        Analisar dose
      </button>

      {recomendacao && <p className="recomendacao-output">{recomendacao}</p>}
      {erro && <p className="erro-output">{erro}</p>}

      <button className="btn-back" onClick={() => navigate("/home")}>Voltar para a página inicial</button>
    </div>
  );
};

export default Recomendacoes;
