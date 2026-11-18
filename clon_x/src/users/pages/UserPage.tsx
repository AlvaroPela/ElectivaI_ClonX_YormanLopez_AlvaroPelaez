import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { FeedPost } from "../../firebase/feed";
import {
  findProfileByUsername,
  getDisplayName,
  watchUserPosts,
} from "../../firebase/follows";
import type { Profile } from "../../firebase/profiles";
import { PostCard } from "../../posts/components/PostCard";
import { Pagination } from "../../ui/components/Pagination";
import { paginate } from "../../ui/helpers/paginate";
import { FollowButton } from "../components/FollowButton";
import { FollowCounts } from "../components/FollowCounts";
import { useFollowedIds } from "../hooks/useFollowedIds";
import { useWatch } from "../hooks/useWatch";

const noPosts: FeedPost[] = [];

// Page of one user (/user/:username): counters, [Seguir] button and
// their posts from the most recent to the oldest, 10 per page.
export const UserPage = () => {
  const { username = "" } = useParams();

  // The key resets the page number and the data when the username changes.
  return <UserProfile key={username} username={username} />;
};

const UserProfile = ({ username }: { username: string }) => {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [page, setPage] = useState(1);

  useEffect(() => {
    findProfileByUsername(username)
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [username]);

  const postsWatcher = useCallback(
    (onChange: (posts: FeedPost[]) => void, onError: (error: Error) => void) =>
      watchUserPosts(profile?.uid || "", onChange, onError),
    [profile?.uid],
  );
  const { value: posts, error } = useWatch(profile ? postsWatcher : null, noPosts);
  const postsPage = paginate(posts, page);

  if (profile === undefined) return <PageMessage text="Cargando perfil..." />;
  if (profile === null) return <PageMessage text={`No existe el usuario @${username}.`} />;

  return (
    <main className="x-page-shell">
      <header className="x-user-header">
        <div>
          <h1>{getDisplayName(profile)}</h1>
          <p className="text-secondary mb-0">@{profile.handle}</p>
        </div>
        <UserFollowButton targetUid={profile.uid} />
      </header>
      <FollowCounts uid={profile.uid} username={profile.handle} />

      <section className="x-post-list mt-3" aria-label="Publicaciones">
        {postsPage.items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <p className="x-empty-feed">{error || "Este usuario aún no ha publicado."}</p>
        )}
        <Pagination
          page={postsPage.page}
          totalPages={postsPage.totalPages}
          onPageChange={setPage}
        />
      </section>
    </main>
  );
};

// Follow button that knows if the logged user already follows the target.
const UserFollowButton = ({ targetUid }: { targetUid: string }) => {
  const followedIds = useFollowedIds();

  return <FollowButton targetUid={targetUid} isFollowing={followedIds.has(targetUid)} />;
};

const PageMessage = ({ text }: { text: string }) => (
  <main className="x-page-shell">
    <p className="text-secondary">{text}</p>
  </main>
);
