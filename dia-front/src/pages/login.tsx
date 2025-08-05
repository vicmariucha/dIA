import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase"; // Adicione o Firestore (db)
import { doc, getDoc } from "firebase/firestore"; // Para buscar dados do usuário
import "../styles/login.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Autenticar usuário
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar os dados do Firestore para verificar o tipo de usuário
      const userDocRef = doc(db as any, "usuarios", user.uid); // Ajustado para compatibilidade com TypeScript
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Redirecionar com base no tipo de usuário
        if (userData.tipoUsuario === "Profissional de Saúde") {
          navigate("/medico"); // Redirecionar para a página médico
        } else {
          navigate("/home"); // Redirecionar para a página principal
        }
      } else {
        setError("Usuário não encontrado no sistema.");
      }
    } catch (err) {
      console.error(err);
      setError("Email ou senha inválidos. Tente novamente.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Bem-vindo ao dIA!</h1>
        <p>Personalize a sua autogestão do diabetes com tecnologia de ponta.</p>
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Login</h1>
          {error && <p className="error">{error}</p>}
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
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>
          <a className="reset-link-small" onClick={() => navigate("/recuperarSenha")}>
            Esqueceu a senha?
          </a>
          <button type="submit" className="btn">Entrar</button>
          <p>
            Não tem conta?{" "}
            <a className="reset-link" onClick={() => navigate("/registro")}>
              <strong>Cadastre-se</strong>
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
