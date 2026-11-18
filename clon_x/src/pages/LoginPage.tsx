import { useContext, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/contexts/AuthContext";
import { XLogo } from "../ui/components/XLogo";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import logo from "../assets/logo.png";

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

export const LoginPage = () => {
  const { authState, login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!authState.loading && authState.logged) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const success = await login(email.trim(), password);
    setSubmitting(false);

    if (success) {
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.pathname || "/", { replace: true });
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <XLogo className="auth-logo" />
        <h1 id="login-title">Lo que está pasando ahora</h1>
        <p className="auth-subtitle">Inicia sesión en X</p>

        <form onSubmit={onSubmit}>
          <label className="auth-field">
            <span>Correo electrónico</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="auth-field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {authState.errorMessage && (
            <p className="auth-error" role="alert">
              {authState.errorMessage}
            </p>
          )}
          <button
            type="submit"
            className="auth-button"
            disabled={submitting || authState.loading}
          >
            {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </section>
    </main>
  );
};
