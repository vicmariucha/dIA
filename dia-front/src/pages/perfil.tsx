import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import "../styles/perfil.css";

interface Usuario {
  nome: string;
  email: string;
  dataNascimento: string;
  tipoUsuario: string;
  tipoDiabetes: string;
  altura: string;
  peso: string;
  hipoglicemia: string;
  hiperglicemia: string;
  crm: string;
  especialidade: string;
  instituicao: string;
}

const Perfil = () => {
  const [dados, setDados] = useState<Usuario>({
    nome: "",
    email: "",
    dataNascimento: "",
    tipoUsuario: "",
    tipoDiabetes: "",
    altura: "",
    peso: "",
    hipoglicemia: "",
    hiperglicemia: "",
    crm: "",
    especialidade: "",
    instituicao: "",
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [novaFoto, setNovaFoto] = useState<File | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const userDoc = doc(db as any, "usuarios", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data() as Usuario; // Garantimos que os dados possuem o formato correto
          setDados({
            ...data,
            dataNascimento: data.dataNascimento
              ? new Date(data.dataNascimento).toISOString().split("T")[0]
              : "",
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erro ao carregar dados: ", error.message);
        } else {
          console.error("Erro desconhecido ao carregar dados.");
        }
      }
    };

    carregarDados();
  }, []);

  const salvarPerfil = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado.");

      const userDoc = doc(db as any, "usuarios", user.uid);
      await setDoc(userDoc, {
        ...dados,
        dataNascimento: dados.dataNascimento
          ? new Date(dados.dataNascimento).toISOString()
          : "",
      });
      alert("Perfil atualizado com sucesso!");
      setModoEdicao(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao salvar perfil: ", error.message);
      } else {
        console.error("Erro desconhecido ao salvar perfil.");
      }
    }
  };

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setNovaFoto(file);
  };

  const handleNumericInput = (value: string, campo: keyof Usuario) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Permite apenas números
    setDados({ ...dados, [campo]: numericValue });
  };

  return (
    <div className="perfil-container">
      <h1>Meu perfil</h1>

      {/* Foto de perfil */}
      <div className="foto-perfil-container">
        <img
          src={
            novaFoto
              ? URL.createObjectURL(novaFoto)
              : "https://via.placeholder.com/100"
          }
          alt="Foto do Perfil"
          className="foto-perfil"
        />
        {modoEdicao && (
          <input
            type="file"
            accept="image/*"
            className="input-foto"
            onChange={handleFotoChange}
          />
        )}
      </div>

      {/* Campos comuns */}
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          value={dados.nome}
          onChange={(e) => setDados({ ...dados, nome: e.target.value })}
          disabled={!modoEdicao}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={dados.email}
          onChange={(e) => setDados({ ...dados, email: e.target.value })}
          disabled={!modoEdicao}
        />
      </div>

      {/* Campos específicos */}
      {dados.tipoUsuario === "Profissional de Saúde" && (
        <>
          <div className="form-row">
            <div className="form-group half">
              <label>Data de nascimento</label>
              <input
                type="date"
                value={dados.dataNascimento}
                onChange={(e) =>
                  setDados({ ...dados, dataNascimento: e.target.value })
                }
                disabled={!modoEdicao}
              />
            </div>
            <div className="form-group half">
              <label>CRM</label>
              <input
                type="text"
                value={dados.crm}
                onChange={(e) => setDados({ ...dados, crm: e.target.value })}
                disabled={!modoEdicao}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Especialidade</label>
            <input
              type="text"
              value={dados.especialidade}
              onChange={(e) =>
                setDados({ ...dados, especialidade: e.target.value })
              }
              disabled={!modoEdicao}
            />
          </div>
          <div className="form-group">
            <label>Instituição onde se formou</label>
            <input
              type="text"
              value={dados.instituicao}
              onChange={(e) =>
                setDados({ ...dados, instituicao: e.target.value })
              }
              disabled={!modoEdicao}
            />
          </div>
        </>
      )}

      {/* Paciente */}
      {dados.tipoUsuario === "Paciente" && (
        <>
          <div className="form-group">
            <label>Data de nascimento</label>
            <input
              type="date"
              value={dados.dataNascimento}
              onChange={(e) =>
                setDados({ ...dados, dataNascimento: e.target.value })
              }
              disabled={!modoEdicao}
            />
          </div>
          <div className="form-group">
            <label>Tipo de diabetes</label>
            <select
              value={dados.tipoDiabetes}
              onChange={(e) =>
                setDados({ ...dados, tipoDiabetes: e.target.value })
              }
              disabled={!modoEdicao}
            >
              <option value="">Selecione</option>
              <option value="Tipo 1">Diabetes tipo 1</option>
              <option value="Tipo 2">Diabetes tipo 2</option>
              <option value="Gestacional">Gestacional</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group small-input">
              <label>Altura (cm)</label>
              <input
                type="number"
                value={dados.altura}
                onChange={(e) => handleNumericInput(e.target.value, "altura")}
                disabled={!modoEdicao}
              />
            </div>
            <div className="form-group small-input">
              <label>Peso (kg)</label>
              <input
                type="number"
                value={dados.peso}
                onChange={(e) => handleNumericInput(e.target.value, "peso")}
                disabled={!modoEdicao}
              />
            </div>
          </div>
        </>
      )}

      {/* Botões */}
      <div className="button-row">
        {modoEdicao ? (
          <>
            <button className="btn" onClick={salvarPerfil}>
              Salvar
            </button>
            <button className="btn-back" onClick={() => setModoEdicao(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn" onClick={() => setModoEdicao(true)}>
            Editar
          </button>
        )}
        <button className="btn-back" onClick={() => window.history.back()}>
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Perfil;
