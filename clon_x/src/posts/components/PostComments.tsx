import { useContext, useState, type FormEvent } from "react";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { addComment, type PostComment } from "../../firebase/comments";
import { formatPostDate } from "../helpers/formatPostDate";

const maxCommentLength = 280;

interface PostCommentsProps {
  postId: string;
  comments: PostComment[];
}

// List of comments of a post and the form to write a new one.
export const PostComments = ({ postId, comments }: PostCommentsProps) => {
  const { authState } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = authState.user;
    if (!user || !text.trim()) return;

    setSending(true);
    setError(null);
    try {
      await addComment(postId, {
        uid: user.uid,
        author: user.fullName,
        handle: `@${user.username}`,
        text: text.trim(),
      });
      setText("");
    } catch {
      setError("No se pudo enviar el comentario.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="x-comments" aria-label="Comentarios">
      {comments.map((comment) => (
        <div key={comment.id} className="x-comment">
          <p className="x-post-meta">
            <strong>{comment.author}</strong>, <span>{comment.handle}</span>
            <span> - {formatPostDate(comment.createdAt)}</span>
          </p>
          <p>{comment.text}</p>
        </div>
      ))}

      <form className="x-comment-form" onSubmit={onSubmit}>
        <input
          placeholder="Escribe un comentario"
          aria-label="Escribe un comentario"
          maxLength={maxCommentLength}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit" disabled={sending || !text.trim()}>
          {sending ? "..." : "Responder"}
        </button>
      </form>
      {error && <p className="x-inline-error" role="alert">{error}</p>}
    </section>
  );
};
