import { useState } from "react";
import "../styles/historico.css";

type Registro = {
  id: string;
  dateTime: Date;
  value?: number; // Usado para insulina e alimentos
  glicemia?: number; // Usado para glicemias
  atividade?: string; // Descrição da atividade física
  observacao?: string;
};

const Historico = () => {
  const [activeTab, setActiveTab] = useState<string>("glicemias");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Gera datas simuladas para os últimos 5 dias
  const generateDates = (days: number) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      dates.push(new Date(new Date().setDate(new Date().getDate() - i)));
    }
    return dates;
  };

  const dates = generateDates(5);

  // Dados fictícios para glicemias (4 registros por dia)
  const glicemias: Registro[] = dates.flatMap((date) => [
    {
      id: `glicemia-${date.toISOString()}-1`,
      dateTime: new Date(date.setHours(7, 30)),
      glicemia: Math.floor(Math.random() * (120 - 80) + 80),
      observacao: "Em jejum",
    },
    {
      id: `glicemia-${date.toISOString()}-2`,
      dateTime: new Date(date.setHours(12, 30)),
      glicemia: Math.floor(Math.random() * (160 - 110) + 110),
      observacao: "Pós-prandial (almoço)",
    },
    {
      id: `glicemia-${date.toISOString()}-3`,
      dateTime: new Date(date.setHours(18, 30)),
      glicemia: Math.floor(Math.random() * (140 - 100) + 100),
      observacao: "Pré-jantar",
    },
    {
      id: `glicemia-${date.toISOString()}-4`,
      dateTime: new Date(date.setHours(22, 0)),
      glicemia: Math.floor(Math.random() * (130 - 90) + 90),
      observacao: "Antes de dormir",
    },
  ]);

  // Dados fictícios para insulina (3 registros por dia: basal e bolus/correção)
  const insulinas: Registro[] = dates.flatMap((date) => [
    {
      id: `insulina-${date.toISOString()}-1`,
      dateTime: new Date(date.setHours(8, 0)),
      value: Math.floor(Math.random() * (25 - 10) + 10),
      observacao: "Dose basal (manhã)",
    },
    {
      id: `insulina-${date.toISOString()}-2`,
      dateTime: new Date(date.setHours(12, 45)),
      value: Math.floor(Math.random() * (6 - 3) + 3),
      observacao: "Correção pós-almoço",
    },
    {
      id: `insulina-${date.toISOString()}-3`,
      dateTime: new Date(date.setHours(19, 0)),
      value: Math.floor(Math.random() * (6 - 3) + 3),
      observacao: "Correção pós-jantar",
    },
  ]);

  // Dados fictícios para atividades físicas
  const atividades: Registro[] = dates.flatMap((date, index) => [
    {
      id: `atividade-${date.toISOString()}-1`,
      dateTime: new Date(date.setHours(16, 0)),
      atividade: index % 2 === 0 ? "Caminhada leve" : "Treinamento de força",
      observacao: index % 2 === 0 ? "30 minutos" : "60 minutos",
    },
  ]);

  // Dados fictícios para alimentos (2 refeições principais por dia)
  const alimentos: Registro[] = dates.flatMap((date) => [
    {
      id: `alimento-${date.toISOString()}-1`,
      dateTime: new Date(date.setHours(8, 30)),
      value: Math.floor(Math.random() * (50 - 15) + 15),
      observacao: "Café da manhã",
    },
    {
      id: `alimento-${date.toISOString()}-2`,
      dateTime: new Date(date.setHours(13, 0)),
      value: Math.floor(Math.random() * (80 - 30) + 30),
      observacao: "Almoço",
    },
  ]);

  // Função para obter os dados da aba ativa
  const getActiveData = (): Registro[] => {
    switch (activeTab) {
      case "glicemias":
        return glicemias;
      case "insulina":
        return insulinas;
      case "atividades":
        return atividades;
      case "alimentos":
        return alimentos;
      default:
        return [];
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Resetar para a primeira página ao mudar de aba
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const registros = getActiveData();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = registros.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(registros.length / itemsPerPage);

  return (
    <div className="historico-container">
      <h1>Histórico</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "glicemias" ? "active" : ""}
          onClick={() => handleTabChange("glicemias")}
        >
          Glicemias
        </button>
        <button
          className={activeTab === "insulina" ? "active" : ""}
          onClick={() => handleTabChange("insulina")}
        >
          Insulinas
        </button>
        <button
          className={activeTab === "atividades" ? "active" : ""}
          onClick={() => handleTabChange("atividades")}
        >
          Atividades
        </button>
        <button
          className={activeTab === "alimentos" ? "active" : ""}
          onClick={() => handleTabChange("alimentos")}
        >
          Alimentos
        </button>
      </div>

      {/* Cards */}
      <div className="cards-container">
        {currentItems.map((registro) => (
          <div className="card" key={registro.id}>
            <p>
              <strong>Data:</strong> {registro.dateTime?.toLocaleDateString() || "N/A"}
            </p>
            <p>
              <strong>Hora:</strong> {registro.dateTime?.toLocaleTimeString() || "N/A"}
            </p>
            {activeTab === "glicemias" && (
              <p>
                <strong>Glicemia:</strong> {registro.glicemia} mg/dL
              </p>
            )}
            {activeTab === "insulina" && (
              <p>
                <strong>Unidades:</strong> {registro.value} U
              </p>
            )}
            {activeTab === "atividades" && (
              <p>
                <strong>Atividade:</strong> {registro.atividade}
              </p>
            )}
            {activeTab === "alimentos" && (
              <p>
                <strong>Carboidratos:</strong> {registro.value} g
              </p>
            )}
            <p>
              <strong>Observação:</strong> {registro.observacao || "Nenhuma observação."}
            </p>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Botão Voltar */}
      <button
        className="btn-back"
        onClick={() => (window.location.href = "/home")}
      >
        Voltar para a tela inicial
      </button>
    </div>
  );
};

export default Historico;
