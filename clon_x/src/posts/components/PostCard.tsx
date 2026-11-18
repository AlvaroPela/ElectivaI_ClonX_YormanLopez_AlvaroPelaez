import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { watchComments, type PostComment } from "../../firebase/comments";
import type { FeedPost } from "../../firebase/feed";
import { XIcon, type XIconName } from "../../ui/components/XIcon";
import { useWatch } from "../../users/hooks/useWatch";
import { formatPostDate } from "../helpers/formatPostDate";
import { PostComments } from "./PostComments";

const otherActions: { icon: XIconName; label: string }[] = [
  { icon: "repost", label: "Repostear" },
  { icon: "like", label: "Me gusta" },
  { icon: "share", label: "Compartir" },
];

const noComments: PostComment[] = [];

interface PostCardProps {
  post: FeedPost;
}

// Shows one post with the format required by the project:
// "Full name, @username - Date and time" and then the body of the post.
export const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const commentsWatcher = useCallback(
    (onChange: (comments: PostComment[]) => void, onError: (error: Error) => void) =>
      watchComments(post.id, onChange, onError),
    [post.id],
  );
  const { value: comments } = useWatch(commentsWatcher, noComments);

  return (
    <article className="x-post">
      <span className="x-avatar x-avatar-muted">
        {post.author.charAt(0).toUpperCase()}
      </span>
      <div className="x-post-body">
        <div className="x-post-heading">
          <p className="x-post-meta">
            <Link to={`/user/${post.uid}`} className="x-post-author">
              <strong>{post.author}</strong>, <span>{post.handle}</span>
            </Link>
            <span> - </span>
            <time dateTime={post.createdAt?.toISOString()}>
              {formatPostDate(post.createdAt)}
            </time>
          </p>
          <button type="button" aria-label="Más opciones">
            <XIcon name="more" />
          </button>
        </div>
        {post.text && <p>{post.text}</p>}
        {post.imageURL && (
          <img className="x-post-image" src={post.imageURL} alt="Imagen del post" loading="lazy" />
        )}
        <div className="x-post-actions">
          <button
            type="button"
            className="x-post-action-reply"
            aria-label="Comentarios"
            aria-expanded={showComments}
            title="Comentarios"
            onClick={() => setShowComments((current) => !current)}
          >
            <XIcon name="reply" />
            <span>{comments.length}</span>
          </button>
          {otherActions.map(({ icon, label }) => (
            <button
              key={icon}
              type="button"
              className={`x-post-action-${icon}`}
              aria-label={label}
              title={label}
            >
              <XIcon name={icon} />
            </button>
          ))}
        </div>
        {showComments && <PostComments postId={post.id} comments={comments} />}
      </div>
    </article>
  );
};
