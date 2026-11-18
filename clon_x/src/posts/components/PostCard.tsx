import type { FeedPost } from "../../firebase/feed";
import { XIcon, type XIconName } from "../../ui/components/XIcon";
import { formatPostDate } from "../helpers/formatPostDate";

const postActions: { icon: XIconName; label: string }[] = [
  { icon: "reply", label: "Responder" },
  { icon: "repost", label: "Repostear" },
  { icon: "like", label: "Me gusta" },
  { icon: "share", label: "Compartir" },
];

interface PostCardProps {
  post: FeedPost;
}

// Shows one post with the format required by the project:
// "Full name, @username - Date and time" and then the body of the post.
export const PostCard = ({ post }: PostCardProps) => (
  <article className="x-post">
    <span className="x-avatar x-avatar-muted">
      {post.author.charAt(0).toUpperCase()}
    </span>
    <div className="x-post-body">
      <div className="x-post-heading">
        <p className="x-post-meta">
          <strong>{post.author}</strong>, <span>{post.handle}</span>
          <span> - </span>
          <time dateTime={post.createdAt?.toISOString()}>
            {formatPostDate(post.createdAt)}
          </time>
        </p>
        <button type="button" aria-label="Más opciones">
          <XIcon name="more" />
        </button>
      </div>
      <p>{post.text}</p>
      <div className="x-post-actions">
        {postActions.map(({ icon, label }) => (
          <button
            key={icon}
            type="button"
            className={`x-post-action-${icon}`}
            aria-label={label}
            title={label}
          >
            <XIcon name={icon} />
            <span>{icon === "reply" || icon === "repost" ? "0" : ""}</span>
          </button>
        ))}
      </div>
    </div>
  </article>
);
