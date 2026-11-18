import { useCallback } from "react";
import { Link } from "react-router-dom";
import { watchFollowCounts } from "../../firebase/profiles";
import { useWatch } from "../hooks/useWatch";

interface FollowCountsProps {
  uid: string;
  username: string;
}

const emptyCounts = { followers: 0, following: 0 };

// "X Siguiendo · Y Seguidores" with links to both lists of the user.
export const FollowCounts = ({ uid, username }: FollowCountsProps) => {
  const watcher = useCallback(
    (
      onChange: (counts: typeof emptyCounts) => void,
      onError: (error: Error) => void,
    ) => watchFollowCounts(uid, onChange, onError),
    [uid],
  );
  const { value: counts } = useWatch(watcher, emptyCounts);

  return (
    <div className="x-profile-stats">
      <Link to={`/user/${username}/following`}>
        <strong>{counts.following}</strong> Siguiendo
      </Link>
      <Link to={`/user/${username}/followers`}>
        <strong>{counts.followers}</strong> Seguidores
      </Link>
    </div>
  );
};
