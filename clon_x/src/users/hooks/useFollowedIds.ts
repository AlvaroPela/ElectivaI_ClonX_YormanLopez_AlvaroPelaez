import { useCallback, useContext } from "react";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { watchFollowedIds } from "../../firebase/profiles";
import { useWatch } from "./useWatch";

const noIds = new Set<string>();

// Ids of the accounts that the logged user follows, updated in real time.
export const useFollowedIds = () => {
  const { authState } = useContext(AuthContext);
  const currentUid = authState.user?.uid || "";
  const watcher = useCallback(
    (onChange: (ids: Set<string>) => void, onError: (error: Error) => void) =>
      watchFollowedIds(currentUid, onChange, onError),
    [currentUid],
  );

  return useWatch(currentUid ? watcher : null, noIds).value;
};
