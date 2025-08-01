import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase"; // Certifique-se de configurar o Firebase corretamente
import "../styles/recuperarSenha.css";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Um link para redefinir sua senha foi enviado para o e-mail informado.");
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code === "auth/user-not-found") {
        setError("Email não cadastrado no sistema. Cadastre-se.");
      } else {
        setError("Ocorreu um erro. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <div className="recuperar-senha-container">
      <h1>Recuperar senha</h1>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="recuperar-senha-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Recuperar
        </button>
      </form>
      <button className="btn-back" onClick={() => (window.location.href = "/login")}>
        Voltar ao login
      </button>
    </div>
  );
};

export default RecuperarSenha;
