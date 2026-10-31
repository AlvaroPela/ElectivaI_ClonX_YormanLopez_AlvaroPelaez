import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { useContext } from "react";

export const NavBar = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLoginButton = () => {
    navigate("/login", {
      replace: true,
    });
  };

  const onLogoutButton = () => {
    const result = logout();
    console.log("Logout:", result);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Clon X
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">
                Perfil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/notifications">
                Notificaciones
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/history">
                Guardados
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/chats">
                Chats
              </NavLink>
            </li>
          </ul>
          {!authState.logged ? (
            <button
              className="btn-outline theme-success"
              type="button"
              onClick={onLoginButton}
            >
              Login
            </button>
          ) : (
            <>
              <button
                className="btn-outline theme-danger"
                type="button"
                onClick={onLogoutButton}
              >
                Logout
              </button>
              <span>{authState.user.username || authState.user.email}</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
