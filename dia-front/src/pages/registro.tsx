import { useState, ChangeEvent, FormEvent } from "react"; 
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../styles/registro.css";

const Registro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    dataNascimento: "",
    tipoUsuario: "",
    tipoDiabetes: "",
    dataDescoberta: "",
    tratamento: "",
    mediçõesDiárias: "",
    tomaInsulina: false,
    tipoInsulina: "",
    frequênciaInsulina: "",
    frequênciaPersonalizada: "",
    insulinas: "",
    hipoglicemia: "",
    hiperglicemia: "",
    especialidade: "",
    crm: "",
    instituicao: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? isChecked : value,
    });
    setError(null);
  };

  const handleSwitchChange = () => {
    setFormData((prev) => ({ ...prev, tomaInsulina: !prev.tomaInsulina }));
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.nome) {
      setError("O campo 'Nome completo' é obrigatório.");
      return;
    }
    if (!formData.email) {
      setError("O campo 'Email' é obrigatório.");
      return;
    }
    if (!formData.senha) {
      setError("O campo 'Senha' é obrigatório.");
      return;
    }
    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (!formData.dataNascimento) {
      setError("O campo 'Data de nascimento' é obrigatório.");
      return;
    }
    if (!formData.tipoUsuario) {
      setError("Você deve selecionar uma opção no campo 'Eu sou...'.");
      return;
    }

    setError(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.tipoUsuario === "Paciente") {
      if (!formData.tipoDiabetes) {
        setError("O campo 'Tipo de diabetes' é obrigatório.");
        return;
      }
      if (!formData.dataDescoberta) {
        setError("O campo 'Quando descobriu?' é obrigatório.");
        return;
      }
      if (!formData.tratamento) {
        setError("O campo 'Qual tratamento faz?' é obrigatório.");
        return;
      }
      if (!formData.mediçõesDiárias) {
        setError("O campo 'Quantas vezes mede a glicemia por dia?' é obrigatório.");
        return;
      }
      if (formData.tomaInsulina) {
        if (!formData.tipoInsulina) {
          setError("O campo 'Qual tipo de insulina?' é obrigatório.");
          return;
        }
        if (!formData.frequênciaInsulina) {
          setError("O campo 'Quantas vezes toma insulina?' é obrigatório.");
          return;
        }
        if (!formData.insulinas) {
          setError("O campo 'Quais insulinas utiliza?' é obrigatório.");
          return;
        }
      }
    }

    if (formData.tipoUsuario === "Profissional de Saúde") {
      if (!formData.especialidade) {
        setError("O campo 'Especialidade' é obrigatório.");
        return;
      }
      if (!formData.crm) {
        setError("O campo 'CRM' é obrigatório.");
        return;
      }
      if (!formData.instituicao) {
        setError("O campo 'Instituição onde se formou' é obrigatório.");
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const user = userCredential.user;

      // Adicionar dados ao Firestore
      const userRef = doc(db as any, "usuarios", user.uid);
      await setDoc(userRef, {
        ...formData,
        createdAt: serverTimestamp, 
    });

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Erro ao realizar cadastro. Verifique suas informações.");
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-container">
        <h1>Cadastrar</h1>
        {error && <p className="error">{error}</p>}
        <form className="registro-form" onSubmit={step === 1 ? handleNext : handleRegister}>
          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="nome">Nome completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dataNascimento">Data de nascimento</label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipoUsuario">Eu sou...</label>
                <select
                  id="tipoUsuario"
                  name="tipoUsuario"
                  value={formData.tipoUsuario}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Paciente">Paciente</option>
                  <option value="Profissional de Saúde">Profissional de saúde</option>
                </select>
              </div>
              <button type="submit" className="btn">Próximo</button>
            </>
          )}
          {step === 2 && (
            <>
              {formData.tipoUsuario === "Paciente" && (
                <>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="tipoDiabetes">Tipo de diabetes</label>
                      <select
                        id="tipoDiabetes"
                        name="tipoDiabetes"
                        value={formData.tipoDiabetes}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="Tipo 1">Tipo 1</option>
                        <option value="Tipo 2">Tipo 2</option>
                        <option value="Gestacional">Gestacional</option>
                      </select>
                    </div>
                    <div className="form-group half">
                      <label htmlFor="dataDescoberta">Quando descobriu?</label>
                      <input
                        type="date"
                        id="dataDescoberta"
                        name="dataDescoberta"
                        value={formData.dataDescoberta}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="tratamento">Qual tratamento faz?</label>
                    <select
                      id="tratamento"
                      name="tratamento"
                      value={formData.tratamento}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Medicamento oral">Medicamento oral</option>
                      <option value="Insulina via seringa">Insulina via seringa</option>
                      <option value="Insulina de caneta">Insulina de caneta</option>
                      <option value="Bomba de insulina">Bomba de insulina</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mediçõesDiárias">Quantas vezes mede a glicemia por dia?</label>
                    <input
                      type="number"
                      id="mediçõesDiárias"
                      name="mediçõesDiárias"
                      placeholder="Ex.: 4"
                      value={formData.mediçõesDiárias}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="hipoglicemia">Hipoglicemia (mg/dL)</label>
                      <input
                        type="number"
                        id="hipoglicemia"
                        name="hipoglicemia"
                        placeholder="Ex.: 70"
                        value={formData.hipoglicemia}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group half">
                      <label htmlFor="hiperglicemia">Hiperglicemia (mg/dL)</label>
                      <input
                        type="number"
                        id="hiperglicemia"
                        name="hiperglicemia"
                        placeholder="Ex.: 180"
                        value={formData.hiperglicemia}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="checkbox-group">
                    <label htmlFor="tomaInsulina">Toma insulina?</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        id="tomaInsulina"
                        name="tomaInsulina"
                        checked={formData.tomaInsulina}
                        onChange={handleSwitchChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  {formData.tomaInsulina && (
                    <>
                      <div className="form-group">
                        <label htmlFor="tipoInsulina">Qual tipo de insulina?</label>
                        <select
                          id="tipoInsulina"
                          name="tipoInsulina"
                          value={formData.tipoInsulina}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="Basal">Basal</option>
                          <option value="Bolus">Bolus</option>
                          <option value="Basal e Bolus">Basal e Bolus</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="frequênciaInsulina">Quantas vezes toma insulina?</label>
                        <select
                          id="frequênciaInsulina"
                          name="frequênciaInsulina"
                          value={formData.frequênciaInsulina}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="1 vez por dia">1 vez por dia</option>
                          <option value="2 vezes por dia">2 vezes por dia</option>
                          <option value="3 vezes por dia">3 vezes por dia</option>
                          <option value="4 vezes por dia">4 vezes por dia</option>
                          <option value="6 vezes por dia">6 vezes por dia</option>
                          <option value="Período personalizado">Período personalizado</option>
                        </select>
                      </div>
                      {formData.frequênciaInsulina === "Período personalizado" && (
                        <div className="form-group">
                          <label htmlFor="frequênciaPersonalizada">Detalhe o período</label>
                          <input
                            type="text"
                            id="frequênciaPersonalizada"
                            name="frequênciaPersonalizada"
                            placeholder="Ex.: 2 vezes por dia ou a cada 3 dias"
                            value={formData.frequênciaPersonalizada}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="insulinas">Quais insulinas utiliza?</label>
                        <input
                          type="text"
                          id="insulinas"
                          name="insulinas"
                          placeholder="Ex.: NPH, Regular, Aspart, Glargina"
                          value={formData.insulinas}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}
                </>
              )}
              {formData.tipoUsuario === "Profissional de Saúde" && (
                <>
                  <div className="form-group">
                    <label htmlFor="especialidade">Especialidade</label>
                    <select
                      id="especialidade"
                      name="especialidade"
                      value={formData.especialidade}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Pediatra">Pediatra</option>
                      <option value="Endocrinologista">Endocrinologista</option>
                      <option value="Oftalmologista">Oftalmologista</option>
                      <option value="Nutricionista">Nutricionista</option>
                      <option value="Médico de família">Médico de família</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="crm">CRM</label>
                    <input
                      type="text"
                      id="crm"
                      name="crm"
                      placeholder="Digite o número do CRM"
                      value={formData.crm}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="instituicao">Instituição onde se formou</label>
                    <input
                      type="text"
                      id="instituicao"
                      name="instituicao"
                      placeholder="Digite o nome da instituição"
                      value={formData.instituicao}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}
              <button type="button" className="btn-back" onClick={handleBack}>
                Voltar
              </button>
              <button type="submit" className="btn">Cadastrar</button>
            </>
          )}
        </form>
        <button className="btn-back" onClick={() => navigate("/login")}>
          Voltar para login
        </button>
      </div>
    </div>
  );
};

export default Registro;
