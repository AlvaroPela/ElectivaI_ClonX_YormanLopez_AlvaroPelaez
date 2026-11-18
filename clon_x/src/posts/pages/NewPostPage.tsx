import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { PostContext } from "../contexts/PostContext";
import { ImagePicker, ImagePreview } from "../components/ImagePicker";
import { POST_MESSAGES } from "../helpers/postMessages";
import type { Post } from "../types/postReducerInterfaces";

const maxPostLength = 280;

export const NewPostPage = () => {
  const { authState } = useContext(AuthContext);
  const { savePost } = useContext(PostContext);
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSavePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = authState.user;
    if (!user || (!text.trim() && !imageURL)) return;

    const post: Post = {
      uid: user.uid,
      author: user.fullName,
      handle: `@${user.username}`,
      text: text.trim(),
      ...(imageURL ? { imageURL } : {}),
      createdAt: new Date(),
    };

    setSubmitting(true);
    const result = await savePost(post);
    setSubmitting(false);

    if (!result) {
      setError(POST_MESSAGES.publishError);
      return;
    }

    navigate("/", { replace: true, state: { notice: POST_MESSAGES.published } });
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
          <ImagePreview imageURL={imageURL} onRemove={() => setImageURL(null)} />
          <div className="x-compose-actions">
            <ImagePicker onChange={setImageURL} />
            <span>{maxPostLength - text.length}</span>
            <button type="submit" disabled={(!text.trim() && !imageURL) || submitting}>
              {submitting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
