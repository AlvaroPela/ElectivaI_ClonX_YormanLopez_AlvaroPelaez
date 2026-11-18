import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  findProfileByUsername,
  getDisplayName,
  getProfilesByIds,
  sortByDisplayName,
  watchFollowerIds,
} from "../../firebase/follows";
import { watchFollowedIds, type Profile } from "../../firebase/profiles";
import { Pagination } from "../../ui/components/Pagination";
import { paginate } from "../../ui/helpers/paginate";
import { FollowButton } from "../components/FollowButton";
import { useFollowedIds } from "../hooks/useFollowedIds";
import { useWatch } from "../hooks/useWatch";

type ListType = "following" | "followers";

const titles: Record<ListType, string> = {
  following: "Siguiendo",
  followers: "Seguidores",
};

const noIds: string[] = [];

// Lists of followed users and followers of any user, sorted alphabetically
// by full name and paginated 10 per page.
export const FollowListPage = ({ type }: { type: ListType }) => {
  const { username = "" } = useParams();

  return <FollowList key={`${type}-${username}`} type={type} username={username} />;
};

const FollowList = ({ type, username }: { type: ListType; username: string }) => {
  const [owner, setOwner] = useState<Profile | null | undefined>(undefined);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const followedIds = useFollowedIds();

  useEffect(() => {
    findProfileByUsername(username)
      .then(setOwner)
      .catch(() => setOwner(null));
  }, [username]);

  const idsWatcher = useCallback(
    (onChange: (ids: string[]) => void, onError: (error: Error) => void) => {
      const ownerUid = owner?.uid || "";
      if (type === "followers") return watchFollowerIds(ownerUid, onChange, onError);

      return watchFollowedIds(ownerUid, (ids) => onChange([...ids]), onError);
    },
    [owner?.uid, type],
  );
  const { value: ids, error } = useWatch(owner ? idsWatcher : null, noIds);

  useEffect(() => {
    getProfilesByIds(ids)
      .then((result) => setProfiles(sortByDisplayName(result)))
      .catch(() => setProfiles([]));
  }, [ids]);

  const listPage = paginate(profiles, page);

  if (owner === null) {
    return (
      <main className="x-page-shell">
        <p className="text-secondary">No existe el usuario @{username}.</p>
      </main>
    );
  }

  return (
    <main className="x-page-shell">
      <h1>{titles[type]}</h1>
      <p className="text-secondary">
        <Link to={`/user/${username}`}>@{owner?.handle || username}</Link>
      </p>

      <section className="x-user-list" aria-label={titles[type]}>
        {listPage.items.map((profile) => (
          <UserListItem
            key={profile.uid}
            profile={profile}
            isFollowing={followedIds.has(profile.uid)}
          />
        ))}
        {profiles.length === 0 && (
          <p className="x-empty-feed">{error || "No hay usuarios en esta lista."}</p>
        )}
      </section>
      <Pagination
        page={listPage.page}
        totalPages={listPage.totalPages}
        onPageChange={setPage}
      />
    </main>
  );
};

interface UserListItemProps {
  profile: Profile;
  isFollowing: boolean;
}

const UserListItem = ({ profile, isFollowing }: UserListItemProps) => (
  <div className="x-suggestion">
    <span className="x-avatar x-avatar-muted">
      {getDisplayName(profile).charAt(0).toUpperCase()}
    </span>
    <Link to={`/user/${profile.handle}`} className="x-suggestion-copy">
      <strong>{getDisplayName(profile)}</strong>
      <span>@{profile.handle}</span>
    </Link>
    <FollowButton targetUid={profile.uid} isFollowing={isFollowing} />
  </div>
);
