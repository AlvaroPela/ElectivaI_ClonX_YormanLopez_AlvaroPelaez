import { useContext, useState } from "react";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { setFollowState } from "../../firebase/profiles";

interface FollowButtonProps {
  targetUid: string;
  isFollowing: boolean;
}

// [Seguir] / [Siguiendo] button. It is not shown on the user's own account.
export const FollowButton = ({ targetUid, isFollowing }: FollowButtonProps) => {
  const { authState } = useContext(AuthContext);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUid = authState.user?.uid;

  if (!currentUid || currentUid === targetUid) return null;

  const onToggle = async () => {
    setPending(true);
    setError(null);
    try {
      await setFollowState(currentUid, targetUid, !isFollowing);
    } catch {
      setError("No se pudo actualizar. Inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`x-follow-button${isFollowing ? " following" : ""}`}
      disabled={pending}
      title={error || undefined}
      onClick={() => void onToggle()}
    >
      {pending ? "..." : isFollowing ? "Siguiendo" : "Seguir"}
    </button>
  );
};
