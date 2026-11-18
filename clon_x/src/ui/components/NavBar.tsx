import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { XIcon, type XIconName } from "./XIcon";
import { XLogo } from "./XLogo";

const menuItems: { label: string; path: string; icon: XIconName }[] = [
  { label: "Inicio", path: "/", icon: "home" },
  { label: "Guardados", path: "/history", icon: "bookmark" },
  { label: "Notificaciones", path: "/notifications", icon: "notifications" },
  { label: "Mensajes", path: "/chats", icon: "messages" },
  { label: "Perfil", path: "/profile", icon: "profile" },
];

export const NavBar = () => {
  const { authState, logout } = useContext(AuthContext);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = authState.user;
  const username = user?.username || "Usuario";
  const initials = username.charAt(0).toUpperCase();

  const onLogout = async () => {
    setError(null);
    try {
      await logout();
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "No se pudo cerrar sesión.",
      );
    }
  };

  const onCompose = () => {
    if (pathname === "/") {
      document.getElementById("post-draft")?.focus();
    } else {
      navigate("/");
    }
  };

  return (
    <aside className="x-left-rail">
      <NavLink to="/" className="x-brand" aria-label="Inicio de Nexo">
        <XLogo />
      </NavLink>

      <nav className="x-navigation" aria-label="Navegación principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `x-nav-link${isActive ? " active" : ""}`
            }
            aria-label={item.label}
          >
            <XIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className="x-post-button"
          aria-label="Publicar"
          onClick={onCompose}
        >
          Publicar
        </button>
      </nav>

      <div className="x-account-area">
        {error && (
          <p className="x-sidebar-error" role="alert">
            {error}
          </p>
        )}
        {accountMenuOpen && (
          <div className="x-account-menu" role="menu" aria-label="Opciones de cuenta">
            <button type="button" role="menuitem" onClick={() => void onLogout()}>
              Cerrar sesión
            </button>
          </div>
        )}
        <button
          type="button"
          className="x-account-button"
          aria-expanded={accountMenuOpen}
          aria-haspopup="menu"
          aria-label="Opciones de cuenta"
          onClick={() => setAccountMenuOpen((isOpen) => !isOpen)}
        >
          {user?.photoURL ? (
            <img className="x-avatar" src={user.photoURL} alt="" />
          ) : (
            <span className="x-avatar">{initials}</span>
          )}
          <span className="x-account-copy">
            <strong>{username}</strong>
            <span>{user?.email ? `@${user.email.split("@")[0]}` : ""}</span>
          </span>
          <XIcon name="more" />
        </button>
      </div>
    </aside>
  );
};
