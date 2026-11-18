import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import { AuthContext } from "../auth/contexts/AuthContext";
import {
  saveProfileImage,
  watchFollowCounts,
  watchProfile,
  type Profile,
} from "../firebase/profiles";
import {
  uploadProfileImage,
  type ProfileImageType,
} from "../firebase/profileImages";
import { Link } from "react-router-dom";
import { XIcon } from "../ui/components/XIcon";

export const ProfilePage = () => {
  const { authState, updatePhotoURL } = useContext(AuthContext);
  const user = authState.user!;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<ProfileImageType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageOverrides, setImageOverrides] = useState<{
    avatar?: string;
    cover?: string;
  }>({});

  useEffect(() => {
    let cancelled = false;
    let stop: (() => void) | undefined;
    watchProfile(
      user.uid,
      setProfile,
      (watchError) => setError(watchError.message),
    )
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stop = unsubscribe;
      })
      .catch((watchError: unknown) =>
        setError(
          watchError instanceof Error
            ? watchError.message
            : "No se pudo cargar el perfil.",
        ),
      );
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [user.uid]);

  useEffect(() => {
    let cancelled = false;
    let stop: (() => void) | undefined;
    watchFollowCounts(
      user.uid,
      setCounts,
      (watchError) => setError(watchError.message),
    )
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stop = unsubscribe;
      })
      .catch((watchError: unknown) =>
        setError(
          watchError instanceof Error
            ? watchError.message
            : "No se pudieron cargar los contadores de seguimiento.",
        ),
      );
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [user.uid]);

  const onImageSelected =
    (type: ProfileImageType) => async (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];
      if (!file) return;

      setUploading(type);
      setUploadProgress(0);
      setUploadError(null);
      try {
        const imageURL = await uploadProfileImage(
          user.uid,
          type,
          file,
          setUploadProgress,
        );
        setImageOverrides((current) => ({ ...current, [type]: imageURL }));
        const profileInput = {
          uid: user.uid,
          email: user.email,
          username: profile?.username || user.username,
          photoURL: user.photoURL,
        };
        await saveProfileImage(profileInput, type, imageURL);
        if (type === "avatar") await updatePhotoURL(imageURL);
      } catch (uploadFailure) {
        setUploadError(
          uploadFailure instanceof Error
            ? uploadFailure.message
            : "No se pudo actualizar la imagen.",
        );
      } finally {
        setUploading(null);
        input.value = "";
      }
    };

  const name = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : user.fullName;
  const avatarURL = imageOverrides.avatar || profile?.photoURL || user.photoURL;
  const coverURL = imageOverrides.cover || profile?.coverURL;

  return (
    <main className="x-page-shell">
      <h1>Perfil</h1>
      <div className="x-profile-banner">
        {coverURL && <img src={coverURL} alt="" />}
        <label className="x-cover-edit">
          <XIcon name="camera" />
          <span>{uploading === "cover" ? `${uploadProgress}%` : "Cambiar portada"}</span>
          <input
            className="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-label="Cambiar foto de portada"
            disabled={uploading !== null}
            onChange={onImageSelected("cover")}
          />
        </label>
      </div>
      <div className="x-profile-photo-row">
        <div className="x-profile-avatar-wrap">
          {avatarURL ? (
            <img className="x-profile-avatar" src={avatarURL} alt={`Foto de ${name}`} />
          ) : (
            <div className="x-profile-avatar">{name.charAt(0).toUpperCase()}</div>
          )}
          <label className="x-avatar-edit" aria-label="Cambiar foto de perfil">
            <XIcon name="camera" />
            <input
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              aria-label="Seleccionar foto de perfil"
              disabled={uploading !== null}
              onChange={onImageSelected("avatar")}
            />
          </label>
        </div>
      </div>
      {uploading && (
        <p className="x-upload-progress" role="status">
          Subiendo {uploading === "avatar" ? "foto de perfil" : "portada"}: {uploadProgress}%
        </p>
      )}
      {uploadError && (
        <p className="x-inline-error mt-3" role="alert">{uploadError}</p>
      )}
      <section aria-label="Información del perfil">
        <h2 className="mt-3 mb-0 fs-5 fw-bold">{name}</h2>
        <p className="text-secondary mb-2">
          @{profile?.handle || user.username}
        </p>
        <div className="x-profile-stats">
          <Link to={`/user/${profile?.handle || user.username}/following`}>
            <strong>{counts.following}</strong> Siguiendo
          </Link>
          <Link to={`/user/${profile?.handle || user.username}/followers`}>
            <strong>{counts.followers}</strong> Seguidores
          </Link>
        </div>
      </section>
      {error && <p className="x-inline-error mt-3" role="alert">{error}</p>}
      {!profile && !error && (
        <p className="text-secondary mt-4">Cargando perfil...</p>
      )}
      <div className="x-secondary-nav mt-4" aria-label="Secciones del perfil">
        <a href="#posts">Publicaciones</a>
        <a href="#replies">Respuestas</a>
        <a href="#media">Multimedia</a>
        <a href="#likes">Me gusta</a>
      </div>
      <p className="text-secondary text-center mt-5" id="posts">
        Tus publicaciones aparecerán aquí.
      </p>
    </main>
  );
};
