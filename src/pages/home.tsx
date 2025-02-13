import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Fab,
  Badge,
  Button,
  Menu,
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
  Checkbox,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Glicemia = { valor: number; data: string };
type Insulina = { dose: number; tipoInsulina: string; data: string };

type Pedido = { profissionalNome?: string };

type Feedback = string;

type Meta = { descricao: string; concluida: boolean };

const Home = () => {
  const navigate = useNavigate();

  // Dados fictícios
  const metasMock: Meta[] = [
    { descricao: "Registrar glicemia 4 vezes", concluida: false },
    { descricao: "Aplicar insulina basal", concluida: true },
    { descricao: "Fazer 30 minutos de atividade física", concluida: false },
    { descricao: "Registrar alimentação do café da manhã", concluida: true },
  ];

  const feedbacksMock: Feedback[] = [
    "Ótimo controle de glicemia!",
    "Reduza carboidratos no almoço.",
  ];

  const pedidosMock: Pedido[] = [
    { profissionalNome: "Dr. Fulano" },
    { profissionalNome: "Dra. Beltrana" },
  ];

  // Estados
  const [glicemiaMedia, setGlicemiaMedia] = useState<string>("Carregando...");
  const [ultimaGlicemia, setUltimaGlicemia] = useState<string>("Carregando...");
  const [insulinaBasalMedia, setInsulinaBasalMedia] = useState<string>("Carregando...");
  const [ultimaDoseInsulina, setUltimaDoseInsulina] = useState<string>("Carregando...");
  const [hba1cEstimado, setHba1cEstimado] = useState<string>("Carregando...");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState<boolean>(false);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [metas, setMetas] = useState<Meta[]>(metasMock);

  const [graficoData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`),
    datasets: [
      {
        label: "Glicemia (mg/dL)",
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 150 + 50)),
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        fill: true,
      },
    ],
  });

  const graficoOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 400,
      },
    },
  };

  useEffect(() => {
    // Simular carregamento dos dados fictícios
    const carregarDados = () => {
      setGlicemiaMedia("120 mg/dL");
      setHba1cEstimado("6.5%");
      setUltimaGlicemia("150 mg/dL (registrado às 08:00");
      setInsulinaBasalMedia("10 U");
      setUltimaDoseInsulina("8 U (Rápida (registrado às 18:00");
      setFeedbacks(feedbacksMock);
      setPedidos(pedidosMock);
      setNotificacoesAtivas(pedidosMock.length > 0);
    };

    carregarDados();
  }, []);

  const handleNotificacoesClick = () => {
    setMostrarNotificacoes((prev) => !prev);
    setMenuAnchorEl(null);
  };

  const handleFabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
    setMostrarNotificacoes(false);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMeta = (index: number) => {
    setMetas((prevMetas) =>
      prevMetas.map((meta, i) =>
        i === index ? { ...meta, concluida: !meta.concluida } : meta
      )
    );
  };

  return (
    <Box
      className="home-container"
      style={{
        padding: "40px 20px",
        maxWidth: "1400px",
        margin: "40px auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Box className="top-bar">
        <Typography variant="h4" className="home-title">
          Dashboard dIA
        </Typography>
        <Box className="icons-container">
          <PersonIcon className="icon" onClick={() => navigate("/perfil")} />
          <Badge
            color="error"
            variant={notificacoesAtivas ? "dot" : undefined}
            className="icon"
            onClick={handleNotificacoesClick}
          >
            <NotificationsIcon />
          </Badge>
          <SettingsIcon className="icon" onClick={() => navigate("/notificacoes")} />
          <LogoutIcon className="icon" onClick={handleLogout} />
        </Box>
      </Box>

      {mostrarNotificacoes && (
        <Popper
          open={mostrarNotificacoes}
          anchorEl={document.querySelector(".icons-container")}
          placement="bottom-end"
          style={{ zIndex: 10 }}
        >
          <ClickAwayListener onClickAway={() => setMostrarNotificacoes(false)}>
            <Paper className="notificacao-popup">
              {pedidos.length === 0 ? (
                <Typography variant="body2">Sem notificações.</Typography>
              ) : (
                pedidos.map((pedido, index) => (
                  <Box key={index} className="pedido-item">
                    <Typography variant="body2">
                      Pedido de: {pedido.profissionalNome || "Profissional Desconhecido"}
                    </Typography>
                    <Button className="btn-aceitar" onClick={() => console.log("Aceitar pedido")}>Aceitar</Button>
                    <Button className="btn-rejeitar" onClick={() => console.log("Rejeitar pedido")}>Rejeitar</Button>
                  </Box>
                ))
              )}
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}

      <Box className="cards-container" display="flex" justifyContent="space-between">
        <Card className="card">
          <CardContent>
            <Typography variant="h6">Glicemia média</Typography>
            <Typography variant="h4">{glicemiaMedia}</Typography>
            <Typography variant="body2">HbA1c estimado: {hba1cEstimado}</Typography>
            <Typography variant="caption">Dados baseados na média dos últimos 30 dias</Typography>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h6">Última glicemia registrada</Typography>
            <Typography variant="h4">{ultimaGlicemia.split(" (")[0]}</Typography>
            <Typography variant="caption">{ultimaGlicemia.split(" (")[1]}</Typography>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h6">Insulina bolus média</Typography>
            <Typography variant="h4">{insulinaBasalMedia}</Typography>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h6">Última dose de insulina</Typography>
            <Typography variant="h4">{ultimaDoseInsulina.split(" (")[0]}</Typography>
            <Typography variant="caption">{ultimaDoseInsulina.split(" (")[1]}</Typography>
          </CardContent>
        </Card>
      </Box>


      <Box className="fab-container" display="flex" justifyContent="space-between" mt={2}>
        <Button className="btn-extra" onClick={() => navigate("/meuMedico")}>Meu Médico</Button>
        <Button className="btn-extra" onClick={() => navigate("/historico")}>Histórico</Button>

        <Fab
          color="primary"
          aria-label="add"
          className="fab"
          onClick={handleFabClick}
        >
          <AddIcon />
        </Fab>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          className="fab-menu"
        >
          <MenuItem onClick={() => navigate("/registrarGlicemia")}>Registrar glicemia</MenuItem>
          <MenuItem onClick={() => navigate("/dosesInsulina")}>Registrar insulina</MenuItem>
          <MenuItem onClick={() => navigate("/atividadeFisica")}>Registrar atividade física</MenuItem>
          <MenuItem onClick={() => navigate("/registroAlimentos")}>Registrar alimentação</MenuItem>
        </Menu>
        <Button className="btn-extra" onClick={() => navigate("/recomendacoes")}>Recomendação</Button>
        <Button className="btn-extra" onClick={() => navigate("/bolus")}>Calculador dose</Button>
      </Box>

      <Box display="flex" mt={4} gap={2}>
      <Box flex={3} height="400px" className="chart-container">
        <Typography variant="h6">Gráfico da glicemia nas últimas 24 horas</Typography>
        <Line data={graficoData} options={graficoOptions} />
      </Box>
      <Box flex={2} display="flex" flexDirection="column" gap={2}>
        <Card className="card" style={{ height: "200px" }}>
          <CardContent>
            <Typography variant="h6">Progresso diário</Typography>
            <List>
              {metas.map((meta, index) => (
                <ListItemButton key={index} onClick={() => toggleMeta(index)}>
                  <Checkbox
                    edge="start"
                    checked={meta.concluida}
                    disableRipple
                  />
                  <ListItemText primary={meta.descricao} />
                  {meta.concluida && (
                    <Typography
                      variant="body2"
                      style={{ color: "green", marginLeft: "10px" }}
                    >
                      Concluído
                    </Typography>
                  )}
                </ListItemButton>
              ))}
            </List>
          </CardContent>
        </Card>
        <Card className="card" style={{ height: "200px" }}>
          <CardContent>
            <Typography variant="h6">Feedbacks recebidos</Typography>
            {feedbacks.map((feedback, index) => (
              <Typography key={index} variant="body2">
                {feedback}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  </Box>
  );
};

export default Home;
