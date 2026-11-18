import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { PostContext } from "../contexts/PostContext";
import type { Post } from "../types/postReducerInterfaces";

const maxPostLength = 280;

export const NewPostPage = () => {
  const { authState } = useContext(AuthContext);
  const { savePost } = useContext(PostContext);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSavePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = authState.user;
    if (!user || !text.trim()) return;

    const post: Post = {
      uid: user.uid,
      author: user.username,
      handle: `@${user.email.split("@")[0]}`,
      text: text.trim(),
      createdAt: new Date(),
    };

    setSubmitting(true);
    const result = await savePost(post);
    setSubmitting(false);

    if (!result) {
      setError("No se pudo publicar el post. Inténtalo de nuevo.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="x-page-shell">
      <h1>Nuevo post</h1>

      {error && (
        <p className="x-inline-error" role="alert">
          {error}
        </p>
      )}

      <form className="x-compose" onSubmit={onSavePost}>
        <div className="x-compose-content">
          <label htmlFor="new-post-text" className="visually-hidden">
            ¿Qué está pasando?
          </label>
          <textarea
            id="new-post-text"
            placeholder="¿Qué está pasando?"
            maxLength={maxPostLength}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <div className="x-compose-actions">
            <span>{maxPostLength - text.length}</span>
            <button type="submit" disabled={!text.trim() || submitting}>
              {submitting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
