import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { useContext } from "react";

export const NavBar = () => {
  const {authState, login, logout} = useContext (AuthContext);

  const onLoginButton = () => {
    const [email, password] = ['pruebas@pruebas.com', '123456'];
    const result = login(email, password);

    console.log('Login:', result);
  }
  const onLogoutButton = () => {
    const result = logout();
    console.log('Logout:', result);
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Blog App</Link>

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
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Profile">Perfil</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Notifications">Notificaciones</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/history">Guardados</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/chats">Chats</NavLink>
            </li>
          </ul>
          {!authState.logged ? (
              <button 
              className="btn-outline theme-success" 
              type="button" 
              onClick={onLoginButton}>
                Login
              </button>
            ) : (
              <>
              <button 
              className="btn-outline theme-danger" 
              type="button" 
              onClick={onLogoutButton}>
                Logout
              </button>
              <span>
                {authState.user.username}
              </span>
              </>
              
            )
          }
        </div>
      </div>
    </nav>
  );
};