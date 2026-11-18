import { useContext, useState, type FormEvent } from "react";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { findProfileByUsername } from "../../firebase/follows";
import { setFollowState } from "../../firebase/profiles";
import { useFollowedIds } from "../hooks/useFollowedIds";

interface FormMessage {
  type: "success" | "error";
  text: string;
}

// Form to follow another account by writing its username.
// It tells the user when the account doesn't exist or is already followed.
export const FollowByUsernameForm = () => {
  const { authState } = useContext(AuthContext);
  const followedIds = useFollowedIds();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const currentUid = authState.user?.uid || "";

  const followUser = async (): Promise<FormMessage> => {
    const profile = await findProfileByUsername(username);

    if (!profile) return { type: "error", text: `No existe el usuario @${username}.` };
    if (profile.uid === currentUid) return { type: "error", text: "No puedes seguirte a ti mismo." };
    if (followedIds.has(profile.uid)) {
      return { type: "error", text: `Ya sigues a @${profile.handle}.` };
    }

    await setFollowState(currentUid, profile.uid, true);
    return { type: "success", text: `Ahora sigues a @${profile.handle}.` };
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) return;

    setSubmitting(true);
    try {
      setMessage(await followUser());
      setUsername("");
    } catch {
      setMessage({ type: "error", text: "No se pudo seguir al usuario. Inténtalo de nuevo." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="x-follow-form" onSubmit={onSubmit}>
      <label htmlFor="follow-username">Seguir por nombre de usuario</label>
      <div>
        <input
          id="follow-username"
          placeholder="@usuario"
          autoComplete="off"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <button type="submit" disabled={submitting || !username.trim()}>
          {submitting ? "..." : "Seguir"}
        </button>
      </div>
      {message && (
        <p className={`x-follow-form-${message.type}`} role="status">
          {message.text}
        </p>
      )}
    </form>
  );
};
