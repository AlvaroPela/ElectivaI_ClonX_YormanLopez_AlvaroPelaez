import { useContext, useState, type ChangeEvent } from "react";
import { AuthContext } from "../auth/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import logo from "../assets/logo.png";

const initialForm = {
  email: "",
  password: "",
};

export const LoginPage = () => {
  const { authState, login } = useContext(AuthContext);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { email, password } = form;

  const onSingIn = async () => {
    const result = await login(email, password);
    if (result) {
      navigate("/", {
        replace: true,
      });
    } else {
      setError(true);
    }
  };
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    setForm({
      ...form,
      [input.name]: input.value,
    });

    console.log(input.name);
  };

  return (
    <>
      <div className="row g-0 min-vh-100 align-items-center">
        <div className="row min-vh-100 align-items-center">
          <div className="col-md-6 d-flex justify-content-center">
            <img src={logo} alt="Logo" className={styles.logo}></img>
          </div>
          <div className="col-md-6 px-4">
            <h1 className={styles.title}>Lo que está pasando ahora</h1>

            <form className={styles.form}>
              {/* Input de Email */}
              <div className="form-outline mb-4">
                <input
                  type="email"
                  name="email"
                  id="form2Example1"
                  value={email}
                  className="form-control"
                  onChange={onInputChange}
                />
                <label className="form-label" htmlFor="form2Example1">
                  Correo Electronico
                </label>
              </div>

              {/* Input password */}
              <div className="form-outline mb-4">
                <input
                  type="password"
                  name="password"
                  id="form2Example2"
                  value={password}
                  className="form-control"
                  onChange={onInputChange}
                />
                <label className="form-label" htmlFor="form2Example2">
                  Contraseña
                </label>
              </div>
              {error && (
                <p className="text-danger">Correo o contraseña incorrecta</p>
              )}
              {/* Botón de Inicio Sesión */}
              <button
                type="button"
                className={`btn btn-light w-100 ${styles.pill}`}
                onClick={onSingIn}
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
