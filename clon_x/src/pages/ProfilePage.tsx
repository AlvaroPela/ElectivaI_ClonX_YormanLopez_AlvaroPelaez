import { useContext, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/contexts/AuthContext";

const profileTabs = ["Publicaciones", "Respuestas", "Multimedia", "Me gusta"];

export const ProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(profileTabs[0]);
  const user = authState.user;
  const [displayName, setDisplayName] = useState(user?.username || "Invitado");
  const [bio, setBio] = useState("");
  const [nameDraft, setNameDraft] = useState(displayName);
  const [bioDraft, setBioDraft] = useState(bio);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const handle = user?.email ? `@${user.email.split("@")[0]}` : "@invitado";
  const initials = displayName.charAt(0).toUpperCase();

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedName = nameDraft.trim();

    if (!updatedName) {
      return;
    }

    setDisplayName(updatedName);
    setBio(bioDraft.trim());
    setEditModalOpen(false);
  };

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
            <button
              type="button"
              className="btn btn-outline-light rounded-pill fw-bold mt-3 ms-auto"
              onClick={() => {
                setNameDraft(displayName);
                setBioDraft(bio);
                setEditModalOpen(true);
              }}
            >
              Editar perfil
            </button>
          </div>

          <div className="px-3 pt-3 pb-3">
            <h2 className="fs-5 fw-bold mb-0">{displayName}</h2>
            <div className="text-secondary">{handle}</div>
            <p className="mt-3 mb-2">{bio || "Aún no has agregado una descripción."}</p>
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
      {editModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75 d-flex align-items-center justify-content-center p-3"
          style={{ zIndex: 1055 }}
        >
          <section
            className="bg-black border border-secondary rounded-4 p-4 w-100"
            style={{ maxWidth: 560 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <form onSubmit={saveProfile}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 id="edit-profile-title" className="fs-5 fw-bold mb-0">
                  Editar perfil
                </h2>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Cerrar"
                  onClick={() => setEditModalOpen(false)}
                />
              </div>
              <label htmlFor="profile-name" className="form-label">
                Nombre
              </label>
              <input
                id="profile-name"
                className="form-control bg-black text-white border-secondary mb-3"
                maxLength={50}
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                required
              />
              <label htmlFor="profile-bio" className="form-label">
                Biografía
              </label>
              <textarea
                id="profile-bio"
                className="form-control bg-black text-white border-secondary"
                maxLength={160}
                rows={3}
                value={bioDraft}
                onChange={(event) => setBioDraft(event.target.value)}
              />
              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className="btn btn-light rounded-pill fw-bold px-4"
                  disabled={!nameDraft.trim()}
                >
                  Guardar
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};
