import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/contexts/AuthContext";

const profileTabs = ["Publicaciones", "Respuestas", "Multimedia", "Me gusta"];

export const ProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(profileTabs[0]);
  const user = authState.user;
  const displayName = user?.username || "Invitado";
  const handle = user?.email ? `@${user.email.split("@")[0]}` : "@invitado";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <main className="container-fluid">
      <div className="row justify-content-center">
        <section className="col-12 col-lg-8 col-xl-7 border-start border-end border-secondary-subtle min-vh-100 px-0">
          <header className="d-flex align-items-center gap-4 px-3 py-2 sticky-top bg-black bg-opacity-75">
            <Link
              to="/"
              className="text-white text-decoration-none fs-4"
              aria-label="Volver al inicio"
            >
              ←
            </Link>
            <div>
              <h1 className="fs-5 fw-bold mb-0">{displayName}</h1>
              <span className="text-secondary small">0 publicaciones</span>
            </div>
          </header>

          <div className="bg-secondary" role="img" aria-label="Portada del perfil" style={{ height: 180 }} />

          <div className="d-flex align-items-start px-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={`Foto de perfil de ${displayName}`}
                className="rounded-circle border border-4 border-black object-fit-cover"
                style={{ width: 128, height: 128, marginTop: -64 }}
              />
            ) : (
              <div
                className="rounded-circle border border-4 border-black bg-primary text-white fs-2 fw-bold d-flex align-items-center justify-content-center"
                aria-label={`Foto de perfil de ${displayName}`}
                style={{ width: 128, height: 128, marginTop: -64 }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="px-3 pt-3 pb-3">
            <h2 className="fs-5 fw-bold mb-0">{displayName}</h2>
            <div className="text-secondary">{handle}</div>
            <p className="mt-3 mb-2">Aún no has agregado una descripción.</p>
            <div className="text-secondary small">
              <span className="me-3">📍 En X</span>
              <span>◷ Se unió recientemente</span>
            </div>
            <div className="d-flex gap-4 mt-3">
              <span><strong>0</strong> <span className="text-secondary">Siguiendo</span></span>
              <span><strong>0</strong> <span className="text-secondary">Seguidores</span></span>
            </div>
          </div>

          <nav className="nav nav-fill border-bottom border-secondary-subtle" aria-label="Secciones del perfil">
            {profileTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`nav-link text-nowrap ${
                  activeTab === tab
                    ? "text-white fw-bold border-bottom border-3 border-primary"
                    : "text-secondary"
                }`}
                aria-pressed={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="text-center px-4 py-5">
            <h2 className="fs-4 fw-bold">
              {activeTab === "Publicaciones"
                ? "Aún no hay publicaciones"
                : `Aún no hay ${activeTab.toLowerCase()}`}
            </h2>
            <p className="text-secondary mb-4">
              Cuando compartas algo, aparecerá aquí en tu perfil.
            </p>
            <Link to="/" className="btn btn-primary rounded-pill fw-bold px-4">
              Ir al inicio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};
