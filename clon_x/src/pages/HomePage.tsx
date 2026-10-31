import { useContext, useState, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../auth/contexts/AuthContext";

interface Post {
  id: number;
  author: string;
  handle: string;
  initials: string;
  text: string;
  time: string;
  replies: number;
  reposts: number;
  likes: number;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: "X",
    handle: "@X",
    initials: "X",
    text: "Bienvenido a X. ¿Qué está pasando?",
    time: "2 h",
    replies: 128,
    reposts: 342,
    likes: 2100,
  },
  {
    id: 2,
    author: "Comunidad",
    handle: "@comunidad",
    initials: "C",
    text: "Un espacio para compartir ideas, descubrir conversaciones y estar al día.",
    time: "4 h",
    replies: 24,
    reposts: 18,
    likes: 156,
  },
];

const menuItems = [
  { label: "Inicio", path: "/", icon: "⌂" },
  { label: "Guardados", path: "/history", icon: "▱" },
  { label: "Notificaciones", path: "/notifications", icon: "♧" },
  { label: "Mensajes", path: "/chats", icon: "✉" },
  { label: "Perfil", path: "/profile", icon: "◉" },
];

const trends = [
  { category: "Tendencia en Colombia", name: "#HoyEnX", posts: "12,4 mil posts" },
  { category: "Tecnología · Tendencia", name: "Inteligencia artificial", posts: "8.320 posts" },
  { category: "Tendencia", name: "Lo que está pasando", posts: "4.105 posts" },
];

export const HomePage = () => {
  const { authState } = useContext(AuthContext);
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");

  const username = authState.user?.username || "Invitado";
  const initials = username.charAt(0).toUpperCase();

  const publishPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text) {
      return;
    }

    setPosts((currentPosts) => [
      {
        id: Date.now(),
        author: username,
        handle: authState.user?.email ? `@${authState.user.email.split("@")[0]}` : "@invitado",
        initials,
        text,
        time: "Ahora",
        replies: 0,
        reposts: 0,
        likes: 0,
      },
      ...currentPosts,
    ]);
    setDraft("");
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <aside className="col-lg-3 col-xl-3 d-none d-lg-flex flex-column align-items-start min-vh-100 py-3 ps-xl-5">
          <NavLink
            to="/"
            className="text-white text-decoration-none fs-2 fw-bold rounded-circle px-3 py-1 mb-3"
            aria-label="Inicio de X"
          >
            X
          </NavLink>

          <nav className="nav flex-column gap-2 w-100" aria-label="Navegación principal">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `nav-link text-white rounded-pill fs-5 d-flex align-items-center gap-3 ${
                    isActive ? "fw-bold" : ""
                  }`
                }
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto d-flex align-items-center gap-2 py-3">
            <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 42, height: 42 }}>
              {initials}
            </div>
            <div className="overflow-hidden">
              <div className="fw-bold text-truncate">{username}</div>
              <div className="text-secondary small text-truncate">
                {authState.user?.email || "@invitado"}
              </div>
            </div>
          </div>
        </aside>

        <main className="col-12 col-lg-6 col-xl-6 border-start border-end border-secondary-subtle min-vh-100 px-0">
          <header className="sticky-top bg-black bg-opacity-75">
            <h1 className="fs-5 fw-bold px-3 pt-3 mb-3">Inicio</h1>
            <div className="row g-0 text-center border-bottom border-secondary-subtle">
              <button type="button" className="col btn text-white fw-bold py-3 border-bottom border-3 border-primary rounded-0">
                Para ti
              </button>
              <button type="button" className="col btn text-secondary py-3 rounded-0">
                Siguiendo
              </button>
            </div>
          </header>

          <form onSubmit={publishPost} className="d-flex gap-3 p-3 border-bottom border-secondary-subtle">
            <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 48, height: 48 }}>
              {initials}
            </div>
            <div className="flex-grow-1">
              <label htmlFor="post-draft" className="visually-hidden">
                ¿Qué está pasando?
              </label>
              <textarea
                id="post-draft"
                className="form-control bg-black text-white border-0 shadow-none fs-5 px-0"
                placeholder="¿Qué está pasando?"
                rows={2}
                maxLength={280}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <div className="d-flex justify-content-end mt-2">
                <button type="submit" className="btn btn-primary rounded-pill fw-bold px-4" disabled={!draft.trim()}>
                  Publicar
                </button>
              </div>
            </div>
          </form>

          <section aria-label="Publicaciones">
            {posts.map((post) => (
              <article key={post.id} className="d-flex gap-3 p-3 border-bottom border-secondary-subtle">
                <div className="rounded-circle bg-secondary text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 48, height: 48 }}>
                  {post.initials}
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex flex-wrap gap-1">
                    <span className="fw-bold">{post.author}</span>
                    <span className="text-secondary">{post.handle} · {post.time}</span>
                  </div>
                  <p className="mb-3 mt-1 text-break">{post.text}</p>
                  <div className="d-flex justify-content-between text-secondary small pe-3">
                    <span aria-label={`${post.replies} respuestas`}>♧ {post.replies}</span>
                    <span aria-label={`${post.reposts} reposts`}>↻ {post.reposts}</span>
                    <span aria-label={`${post.likes} Me gusta`}>♡ {post.likes}</span>
                    <span aria-label="Compartir">↗</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>

        <aside className="col-xl-3 d-none d-xl-block py-3 pe-xl-5">
          <label htmlFor="search" className="visually-hidden">
            Buscar
          </label>
          <input
            id="search"
            type="search"
            className="form-control rounded-pill bg-body-tertiary border-0 mb-3"
            placeholder="Buscar"
          />

          <section className="bg-body-tertiary rounded-4 mb-3">
            <h2 className="fs-5 fw-bold p-3 mb-0">Qué está pasando</h2>
            {trends.map((trend) => (
              <div key={trend.name} className="px-3 py-2">
                <div className="text-secondary small">{trend.category}</div>
                <div className="fw-bold">{trend.name}</div>
                <div className="text-secondary small">{trend.posts}</div>
              </div>
            ))}
            <button type="button" className="btn text-primary text-start w-100 p-3">
              Mostrar más
            </button>
          </section>

          <section className="bg-body-tertiary rounded-4">
            <h2 className="fs-5 fw-bold p-3 mb-0">A quién seguir</h2>
            {[
              { name: "Noticias al día", handle: "@noticiasaldia", initials: "N" },
              { name: "Mundo tecnología", handle: "@mundotech", initials: "M" },
            ].map((account) => (
              <div key={account.handle} className="d-flex align-items-center gap-2 px-3 py-2">
                <div className="rounded-circle bg-secondary text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
                  {account.initials}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-truncate">{account.name}</div>
                  <div className="text-secondary small text-truncate">{account.handle}</div>
                </div>
                <button type="button" className="btn btn-light btn-sm rounded-pill fw-bold">
                  Seguir
                </button>
              </div>
            ))}
            <button type="button" className="btn text-primary text-start w-100 p-3">
              Mostrar más
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
};
