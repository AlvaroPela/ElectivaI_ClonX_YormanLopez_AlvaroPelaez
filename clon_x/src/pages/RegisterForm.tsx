import { Link } from "react-router-dom";

export const RegisterForm = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
      <h1 className="fw-bold mb-4 text-center">Crea tu cuenta</h1>

      <form className="auth-form w-100">
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nombre de usuario
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            autoComplete="new-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            className="form-control"
            id="birthDate"
            name="birthDate"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Número de teléfono
          </label>
          <input type="tel" className="form-control" id="phone" name="phone" />
        </div>

        <button type="button" className="btn btn-light w-100 btn-pill">
          Registrarse
        </button>

        <p className="mt-3 text-center">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};