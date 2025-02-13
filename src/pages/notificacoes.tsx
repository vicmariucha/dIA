import { useState, useEffect } from "react";
import "../styles/notificacoes.css";

const Notificacoes = () => {
  const [quantidadeInsulina, setQuantidadeInsulina] = useState<number>(0);
  const [horariosInsulina, setHorariosInsulina] = useState<string[]>([]);
  const [quantidadeGlicemia, setQuantidadeGlicemia] = useState<number>(0);
  const [horariosGlicemia, setHorariosGlicemia] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [editando, setEditando] = useState(false); // Estado para controle de edição

  // Carregar dados do localStorage ao carregar a página
  useEffect(() => {
    const dadosInsulina = localStorage.getItem("notificacoesInsulina");
    const dadosGlicemia = localStorage.getItem("notificacoesGlicemia");

    if (dadosInsulina) {
      const { quantidade, horarios } = JSON.parse(dadosInsulina);
      setQuantidadeInsulina(quantidade);
      setHorariosInsulina(horarios);
    }

    if (dadosGlicemia) {
      const { quantidade, horarios } = JSON.parse(dadosGlicemia);
      setQuantidadeGlicemia(quantidade);
      setHorariosGlicemia(horarios);
    }
  }, []);

  // Salvar notificações no localStorage
  const salvarNotificacoes = () => {
    const notificacoesInsulina = {
      quantidade: quantidadeInsulina,
      horarios: horariosInsulina,
    };
    const notificacoesGlicemia = {
      quantidade: quantidadeGlicemia,
      horarios: horariosGlicemia,
    };

    localStorage.setItem("notificacoesInsulina", JSON.stringify(notificacoesInsulina));
    localStorage.setItem("notificacoesGlicemia", JSON.stringify(notificacoesGlicemia));

    setSuccessMessage("Notificações configuradas com sucesso!");
    setEditando(false); // Sai do modo de edição
  };

  // Atualizar horários de insulina
  const handleAlterarHorarioInsulina = (index: number, valor: string) => {
    const novosHorarios = [...horariosInsulina];
    novosHorarios[index] = valor;
    setHorariosInsulina(novosHorarios);
  };

  // Atualizar horários de glicemia
  const handleAlterarHorarioGlicemia = (index: number, valor: string) => {
    const novosHorarios = [...horariosGlicemia];
    novosHorarios[index] = valor;
    setHorariosGlicemia(novosHorarios);
  };

  return (
    <div className="notificacoes-container">
      <h1>Configurações de notificações</h1>

      {successMessage && <p className="success">{successMessage}</p>}

      {/* Configuração de lembretes de insulina */}
      <div className="section">
        <h2>Lembretes de insulina</h2>
        {!editando ? (
          <>
            <p>
              <strong>Quantidade:</strong> {quantidadeInsulina}
            </p>
            <ul>
              {horariosInsulina.map((horario, index) => (
                <li key={index}>
                  <strong>Horário {index + 1}:</strong> {horario}
                </li>
              ))}
            </ul>
            <button className="btn" onClick={() => setEditando(true)}>
              Editar notificações
            </button>
          </>
        ) : (
          <>
            <label>Quantos lembretes por dia?</label>
            <input
              type="number"
              className="input"
              min="0"
              value={quantidadeInsulina}
              onChange={(e) => {
                const quantidade = parseInt(e.target.value, 10);
                setQuantidadeInsulina(quantidade);
                setHorariosInsulina(new Array(quantidade).fill(""));
              }}
            />
            {horariosInsulina.map((horario, index) => (
              <div key={index} className="horario-container">
                <p>Qual horário gostaria de ser notificado?</p>
                <input
                  type="time"
                  className="input"
                  value={horario}
                  onChange={(e) =>
                    handleAlterarHorarioInsulina(index, e.target.value)
                  }
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Configuração de lembretes de glicemia */}
      <div className="section">
        <h2>Lembretes de glicemia</h2>
        {!editando ? (
          <>
            <p>
              <strong>Quantidade:</strong> {quantidadeGlicemia}
            </p>
            <ul>
              {horariosGlicemia.map((horario, index) => (
                <li key={index}>
                  <strong>Horário {index + 1}:</strong> {horario}
                </li>
              ))}
            </ul>
            <button className="btn" onClick={() => setEditando(true)}>
              Editar notificações
            </button>
          </>
        ) : (
          <>
            <label>Quantos lembretes por dia?</label>
            <input
              type="number"
              className="input"
              min="0"
              value={quantidadeGlicemia}
              onChange={(e) => {
                const quantidade = parseInt(e.target.value, 10);
                setQuantidadeGlicemia(quantidade);
                setHorariosGlicemia(new Array(quantidade).fill(""));
              }}
            />
            {horariosGlicemia.map((horario, index) => (
              <div key={index} className="horario-container">
                <p>Qual horário gostaria de ser notificado?</p>
                <input
                  type="time"
                  className="input"
                  value={horario}
                  onChange={(e) =>
                    handleAlterarHorarioGlicemia(index, e.target.value)
                  }
                />
              </div>
            ))}
          </>
        )}
      </div>

      {editando && (
        <button className="btn" onClick={salvarNotificacoes}>
          Salvar configurações
        </button>
      )}

      <button
        className="btn-back"
        onClick={() => (window.location.href = "/home")}
      >
        Voltar para a pagina principal
      </button>
    </div>
  );
};

export default Notificacoes;
