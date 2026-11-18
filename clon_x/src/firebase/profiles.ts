import { loadFirestore } from "./firestoreClient";

export interface ProfileInput {
  uid: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthdate?: string;
  photoURL?: string | null;
  coverURL?: string | null;
}

export interface Profile extends ProfileInput {
  handle: string;
}

const userCollection = "users";
const usernameCollection = "usernames";
const usernamePattern = /^[a-z0-9_]{3,15}$/;
const generatedUsernameLength = 11;

export const normalizeUsername = (username: string) =>
  username.trim().replace(/^@/, "").replace(/\s+/g, "").toLowerCase();

export const isValidUsername = (username: string) =>
  usernamePattern.test(normalizeUsername(username));

// Builds a valid username from free text (for example the email of a Google account).
const toUsernameCandidate = (text: string) => {
  const candidate = normalizeUsername(text)
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, generatedUsernameLength);

  return candidate.length >= 3 ? candidate : "usuario";
};

export const isUsernameAvailable = async (username: string) => {
  const { db, doc, getDoc } = await loadFirestore();
  const usernameRef = doc(db, usernameCollection, normalizeUsername(username));
  const snapshot = await getDoc(usernameRef);

  return !snapshot.exists();
};

export const findEmailByUsername = async (
  username: string,
): Promise<string | null> => {
  const { db, doc, getDoc } = await loadFirestore();
  const usernameRef = doc(db, usernameCollection, normalizeUsername(username));
  const snapshot = await getDoc(usernameRef);

  if (!snapshot.exists()) return null;

  return String(snapshot.data().email || "") || null;
};

const parseProfile = (
  uid: string,
  data: Record<string, unknown>,
): Profile => ({
  uid,
  email: typeof data.email === "string" ? data.email : "",
  username: typeof data.username === "string" ? data.username : "usuario",
  handle:
    typeof data.handle === "string"
      ? data.handle
      : typeof data.username === "string"
        ? normalizeUsername(data.username)
        : "usuario",
  firstName: typeof data.firstName === "string" ? data.firstName : undefined,
  lastName: typeof data.lastName === "string" ? data.lastName : undefined,
  phone: typeof data.phone === "string" ? data.phone : undefined,
  birthdate: typeof data.birthdate === "string" ? data.birthdate : undefined,
  photoURL:
    typeof data.photoURL === "string" || data.photoURL === null
      ? data.photoURL
      : undefined,
  coverURL:
    typeof data.coverURL === "string" || data.coverURL === null
      ? data.coverURL
      : undefined,
});

// Returns the stored profile. If the account has no profile yet (first Google login),
// it creates one and reserves a free username built from profile.username.
export const ensureProfile = async (profile: ProfileInput): Promise<Profile> => {
  const { db, doc, runTransaction, serverTimestamp } = await loadFirestore();
  const profileRef = doc(db, userCollection, profile.uid);
  const candidate = toUsernameCandidate(profile.username);
  const alternative = `${candidate}${profile.uid.slice(0, 4).toLowerCase()}`;
  const candidateRef = doc(db, usernameCollection, candidate);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    if (snapshot.exists()) return parseProfile(snapshot.id, snapshot.data());

    const candidateSnapshot = await transaction.get(candidateRef);
    const username = candidateSnapshot.exists() ? alternative : candidate;
    const newProfile: Profile = { ...profile, username, handle: username };

    transaction.set(doc(db, usernameCollection, username), {
      uid: profile.uid,
      email: profile.email,
    });
    transaction.set(profileRef, { ...newProfile, createdAt: serverTimestamp() });

    return newProfile;
  });
};

// Saves the profile of a new account and reserves its username.
// Throws an error if the username already belongs to another account.
export const saveProfile = async (profile: ProfileInput) => {
  const { db, doc, runTransaction, serverTimestamp } = await loadFirestore();
  const username = normalizeUsername(profile.username);
  const profileRef = doc(db, userCollection, profile.uid);
  const usernameRef = doc(db, usernameCollection, username);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    const usernameSnapshot = await transaction.get(usernameRef);
    const usernameOwner = usernameSnapshot.data()?.uid;

    if (usernameOwner && usernameOwner !== profile.uid) {
      throw new Error("Ese nombre de usuario ya está en uso.");
    }

    if (!usernameOwner) {
      transaction.set(usernameRef, { uid: profile.uid, email: profile.email });
    }

    const profileData = {
      ...profile,
      username,
      handle: username,
      updatedAt: serverTimestamp(),
    };

    if (snapshot.exists()) {
      transaction.set(profileRef, profileData, { merge: true });
    } else {
      transaction.set(profileRef, {
        ...profileData,
        createdAt: serverTimestamp(),
      });
    }
  });
};

export const saveProfileImage = async (
  profile: ProfileInput,
  type: "avatar" | "cover",
  imageURL: string,
) => {
  const { db, doc, runTransaction, serverTimestamp } = await loadFirestore();
  const profileRef = doc(db, userCollection, profile.uid);
  const imageField = type === "avatar" ? "photoURL" : "coverURL";

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    const imageData = {
      [imageField]: imageURL,
      updatedAt: serverTimestamp(),
    };

    if (snapshot.exists()) {
      transaction.set(profileRef, imageData, { merge: true });
    } else {
      transaction.set(profileRef, {
        ...profile,
        handle: normalizeUsername(profile.username),
        ...imageData,
        createdAt: serverTimestamp(),
      });
    }
  });
};

export const watchProfileSuggestions = async (
  currentUid: string,
  onChange: (profiles: Profile[]) => void,
  onError: (error: Error) => void,
) => {
  const { db, collection, limit, onSnapshot, query } = await loadFirestore();
  return onSnapshot(
    query(collection(db, userCollection), limit(30)),
    (snapshot) => {
      onChange(
        snapshot.docs
          .filter((userDocument) => userDocument.id !== currentUid)
          .map((userDocument) =>
            parseProfile(
              userDocument.id,
              userDocument.data() as Record<string, unknown>,
            ),
          ),
      );
    },
    onError,
  );
};

export const watchFollowedIds = async (
  currentUid: string,
  onChange: (ids: Set<string>) => void,
  onError: (error: Error) => void,
) => {
  const { db, collection, onSnapshot, query, where } = await loadFirestore();
  return onSnapshot(
    query(collection(db, "follows"), where("followerId", "==", currentUid)),
    (snapshot) => {
      onChange(new Set(snapshot.docs.map((follow) => String(follow.data().followingId))));
    },
    onError,
  );
};

export const watchFollowCounts = async (
  uid: string,
  onChange: (counts: { followers: number; following: number }) => void,
  onError: (error: Error) => void,
) => {
  const { db, collection, onSnapshot, query, where } = await loadFirestore();
  let followers = 0;
  let following = 0;
  const update = () => onChange({ followers, following });
  const followersSubscription = onSnapshot(
    query(collection(db, "follows"), where("followingId", "==", uid)),
    (snapshot) => {
      followers = snapshot.size;
      update();
    },
    onError,
  );
  const followingSubscription = onSnapshot(
    query(collection(db, "follows"), where("followerId", "==", uid)),
    (snapshot) => {
      following = snapshot.size;
      update();
    },
    onError,
  );
  return () => {
    followersSubscription();
    followingSubscription();
  };
};

export const watchProfile = async (
  uid: string,
  onChange: (profile: Profile | null) => void,
  onError: (error: Error) => void,
) => {
  const { db, doc, onSnapshot } = await loadFirestore();
  return onSnapshot(
    doc(db, userCollection, uid),
    (snapshot) => {
      onChange(
        snapshot.exists()
          ? parseProfile(snapshot.id, snapshot.data())
          : null,
      );
    },
    onError,
  );
};

export const setFollowState = async (
  currentUid: string,
  targetUid: string,
  isFollowing: boolean,
) => {
  if (currentUid === targetUid) {
    throw new Error("No puedes seguir tu propia cuenta.");
  }

  const { db, doc, runTransaction } = await loadFirestore();
  const followRef = doc(db, "follows", `${currentUid}_${targetUid}`);

  await runTransaction(db, async (transaction) => {
    const followSnapshot = await transaction.get(followRef);
    if (followSnapshot.exists() === isFollowing) return;

    if (isFollowing) {
      transaction.set(followRef, {
        followerId: currentUid,
        followingId: targetUid,
        createdAt: new Date().toISOString(),
      });
    } else {
      transaction.delete(followRef);
    }
  });
};
