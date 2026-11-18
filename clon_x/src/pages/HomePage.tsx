import { useContext, useEffect, useMemo, useState, type FormEvent } from "react";
import { AuthContext } from "../auth/contexts/AuthContext";
import { publishPost, watchFeed, type FeedPost } from "../firebase/feed";
import {
  setFollowState,
  watchFollowedIds,
  watchProfileSuggestions,
  type Profile,
} from "../firebase/profiles";
import { useLocation, useNavigate } from "react-router-dom";
import { PostCard } from "../posts/components/PostCard";
import { POST_MESSAGES } from "../posts/helpers/postMessages";
import { Pagination } from "../ui/components/Pagination";
import { SuccessToast } from "../ui/components/SuccessToast";
import { paginate } from "../ui/helpers/paginate";
import { XIcon } from "../ui/components/XIcon";
import { FollowByUsernameForm } from "../users/components/FollowByUsernameForm";
import { FollowCounts } from "../users/components/FollowCounts";

const trends = [
  { category: "Tendencia en Colombia", name: "#HoyEnNexo", posts: "12,4 mil posts" },
  {
    category: "Tecnología · Tendencia",
    name: "Inteligencia artificial",
    posts: "8.320 posts",
  },
  { category: "Tendencia", name: "Lo que está pasando", posts: "4.105 posts" },
];

interface Notice {
  id: number;
  text: string;
}

const getNoticeFromState = (state: unknown): Notice | null => {
  const message = (state as { notice?: unknown } | null)?.notice;
  if (typeof message !== "string") return null;

  return { id: Date.now(), text: message };
};

export const HomePage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user!;
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState("");
  // The feed starts with the posts of the user and the accounts they follow.
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("following");
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());
  const [pageError, setPageError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // NewPostPage sends the success message in the navigation state.
  const [notice, setNotice] = useState<Notice | null>(() =>
    getNoticeFromState(location.state),
  );

  // Removes the message from the history so it doesn't appear again on reload.
  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const fullName = user.fullName || "Usuario";
  const initials = fullName.charAt(0).toUpperCase();
  const visiblePosts = useMemo(
    () =>
      activeTab === "for-you"
        ? posts
        : posts.filter(
            (post) => post.uid === user.uid || followedIds.has(post.uid),
          ),
    [activeTab, followedIds, posts, user.uid],
  );
  const feedPage = paginate(visiblePosts, page);

  const changeTab = (tab: "for-you" | "following") => {
    setActiveTab(tab);
    setPage(1);
  };

  const displayedError =
    pageError ||
    (authState.errorMessage
      ? `Aviso de cuenta: ${authState.errorMessage}`
      : null);

  useEffect(() => {
    let cancelled = false;
    let stopFeed: (() => void) | undefined;
    watchFeed(
      setPosts,
      (error) => setPageError(`No se pudo cargar el feed: ${error.message}`),
    )
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stopFeed = unsubscribe;
      })
      .catch((error: unknown) =>
        setPageError(
          `No se pudo conectar con el feed: ${error instanceof Error ? error.message : "error desconocido"}`,
        ),
      );
    return () => {
      cancelled = true;
      stopFeed?.();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let stopSuggestions: (() => void) | undefined;
    let stopFollowing: (() => void) | undefined;
    watchProfileSuggestions(user.uid, setSuggestions, (error) =>
      setPageError(`No se pudieron cargar las cuentas: ${error.message}`),
    )
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stopSuggestions = unsubscribe;
      })
      .catch((error: unknown) =>
        setPageError(
          `No se pudieron cargar las cuentas: ${error instanceof Error ? error.message : "error desconocido"}`,
        ),
      );
    watchFollowedIds(
      user.uid,
      setFollowedIds,
      (error) => setPageError(`No se pudo cargar tu lista de seguidos: ${error.message}`),
    )
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stopFollowing = unsubscribe;
      })
      .catch((error: unknown) =>
        setPageError(
          `No se pudo cargar tu lista de seguidos: ${error instanceof Error ? error.message : "error desconocido"}`,
        ),
      );
    return () => {
      cancelled = true;
      stopSuggestions?.();
      stopFollowing?.();
    };
  }, [user.uid]);

  const onPublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    setPageError(null);
    try {
      await publishPost(
        user.uid,
        fullName,
        `@${user.username}`,
        text,
      );
      setDraft("");
      setNotice({ id: Date.now(), text: POST_MESSAGES.published });
    } catch (error) {
      setPageError(
        `No se pudo publicar: ${error instanceof Error ? error.message : "error desconocido"}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFollow = async (profile: Profile) => {
    const isFollowing = followedIds.has(profile.uid);
    setPendingFollows((current) => new Set(current).add(profile.uid));
    setPageError(null);
    try {
      await setFollowState(user.uid, profile.uid, !isFollowing);
    } catch (error) {
      setPageError(
        `No se pudo actualizar el seguimiento: ${error instanceof Error ? error.message : "error desconocido"}`,
      );
    } finally {
      setPendingFollows((current) => {
        const next = new Set(current);
        next.delete(profile.uid);
        return next;
      });
    }
  };

  return (
    <>
      <main className="x-feed-column">
        <header className="x-feed-header">
          <h1>Inicio</h1>
          <div className="x-home-counts">
            <FollowCounts uid={user.uid} username={user.username} />
          </div>
          <div className="x-feed-tabs" role="tablist" aria-label="Tipo de feed">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "for-you"}
              className={activeTab === "for-you" ? "selected" : ""}
              onClick={() => changeTab("for-you")}
            >
              Para ti
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "following"}
              className={activeTab === "following" ? "selected" : ""}
              onClick={() => changeTab("following")}
            >
              Siguiendo
            </button>
          </div>
        </header>

        {displayedError && (
          <p className="x-inline-error" role="alert">
            {displayedError}
          </p>
        )}

        <form className="x-compose" onSubmit={onPublish}>
          {user.photoURL ? (
            <img className="x-avatar" src={user.photoURL} alt="" />
          ) : (
            <span className="x-avatar">{initials}</span>
          )}
          <div className="x-compose-content">
            <label htmlFor="post-draft" className="visually-hidden">
              ¿Qué está pasando?
            </label>
            <textarea
              id="post-draft"
              placeholder="¿Qué está pasando?"
              maxLength={280}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="x-compose-actions">
              <span>{280 - draft.length}</span>
              <button type="submit" disabled={!draft.trim() || submitting}>
                {submitting ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>
        </form>

        <section className="x-post-list" aria-label="Publicaciones">
          {feedPage.items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {visiblePosts.length === 0 && (
            <div className="x-empty-feed">
              {activeTab === "following"
                ? "Las publicaciones de las cuentas que sigues aparecerán aquí."
                : "Todavía no hay publicaciones. ¡Sé el primero en publicar!"}
            </div>
          )}
          <Pagination
            page={feedPage.page}
            totalPages={feedPage.totalPages}
            onPageChange={setPage}
          />
        </section>
      </main>

      <aside className="x-right-rail">
        <label className="x-search">
          <XIcon name="search" />
          <input type="search" placeholder="Buscar" aria-label="Buscar" />
        </label>
        <section className="x-panel">
          <h2>Qué está pasando</h2>
          {trends.map((trend) => (
            <div className="x-trend" key={trend.name}>
              <span>{trend.category}</span>
              <strong>{trend.name}</strong>
              <span>{trend.posts}</span>
            </div>
          ))}
          <button type="button" className="x-show-more">Mostrar más</button>
        </section>

        <section className="x-panel">
          <FollowByUsernameForm />
        </section>

        <section className="x-panel">
          <h2>A quién seguir</h2>
          {suggestions.map((profile) => {
            const isFollowing = followedIds.has(profile.uid);
            return (
              <div className="x-suggestion" key={profile.uid}>
                <span className="x-avatar x-avatar-muted">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
                <span className="x-suggestion-copy">
                  <strong>{profile.username}</strong>
                  <span>@{profile.handle}</span>
                </span>
                <button
                  type="button"
                  className={isFollowing ? "following" : ""}
                  disabled={pendingFollows.has(profile.uid)}
                  onClick={() => void toggleFollow(profile)}
                >
                  {pendingFollows.has(profile.uid)
                    ? "..."
                    : isFollowing
                      ? "Siguiendo"
                      : "Seguir"}
                </button>
              </div>
            );
          })}
          {suggestions.length === 0 && (
            <p className="x-no-suggestions">Aún no hay otras cuentas para mostrar.</p>
          )}
        </section>
      </aside>

      {notice && <SuccessToast key={notice.id} message={notice.text} />}
    </>
  );
};
