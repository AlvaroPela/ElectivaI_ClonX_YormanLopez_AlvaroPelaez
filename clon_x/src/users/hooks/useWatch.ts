import { useEffect, useState } from "react";

type Watcher<T> = (
  onChange: (value: T) => void,
  onError: (error: Error) => void,
) => Promise<() => void>;

// Listens to a Firestore watcher (watchFeed, watchUserPosts...) while the component
// is mounted and stops it when it unmounts. The watcher must be created with
// useCallback so the listener is not restarted on every render.
export const useWatch = <T>(watcher: Watcher<T> | null, initialValue: T) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!watcher) return;
    let cancelled = false;
    let stop: (() => void) | undefined;

    watcher(setValue, (watchError) => setError(watchError.message))
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stop = unsubscribe;
      })
      .catch(() => setError("No se pudo conectar con la base de datos."));

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [watcher]);

  return { value, error };
};
