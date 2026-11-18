import { useContext, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { RegisterData } from "../auth/contexts/AuthContext";
import { AuthContext } from "../auth/contexts/AuthContext";
import { XLogo } from "../ui/components/XLogo";

const initialForm: RegisterData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  birthdate: "",
  phone: "",
};

export const RegisterPage = () => {
  const { authState, register } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!authState.loading && authState.logged) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const success = await register(form);
    setSubmitting(false);
    if (success) navigate("/", { replace: true });
  };

  const updateField = (field: keyof RegisterData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-wide" aria-labelledby="register-title">
        <XLogo className="auth-logo" />
        <h1 id="register-title">Crea tu cuenta</h1>
        <p className="auth-subtitle">Únete a la conversación.</p>

        <form onSubmit={onSubmit}>
          <div className="auth-fields-grid">
            <label className="auth-field">
              <span>Nombre</span>
              <input
                autoComplete="given-name"
                required
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span>Apellido</span>
              <input
                autoComplete="family-name"
                required
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span>Usuario</span>
              <input
                autoComplete="username"
                required
                value={form.username}
                onChange={(event) => updateField("username", event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span>Correo electrónico</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span>Contraseña</span>
              <input
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span>Fecha de nacimiento</span>
              <input
                type="date"
                required
                value={form.birthdate}
                onChange={(event) => updateField("birthdate", event.target.value)}
              />
            </label>
            <label className="auth-field auth-field-full">
              <span>Teléfono</span>
              <input
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
          </div>
          {authState.errorMessage && (
            <p className="auth-error" role="alert">
              {authState.errorMessage}
            </p>
          )}
          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </section>
    </main>
  );
};
