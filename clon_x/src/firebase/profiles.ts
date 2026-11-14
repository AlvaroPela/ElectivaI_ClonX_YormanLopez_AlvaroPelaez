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

const normalizeHandle = (username: string) =>
  username.trim().replace(/^@/, "").replace(/\s+/g, "").toLowerCase();

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
        ? normalizeHandle(data.username)
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

export const ensureProfile = async (profile: ProfileInput) => {
  const { db, doc, runTransaction, serverTimestamp } = await loadFirestore();
  const profileRef = doc(db, userCollection, profile.uid);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    if (!snapshot.exists()) {
      transaction.set(profileRef, {
        ...profile,
        handle: normalizeHandle(profile.username),
        createdAt: serverTimestamp(),
      });
    }
  });
};

export const saveProfile = async (profile: ProfileInput) => {
  const { db, doc, runTransaction, serverTimestamp } = await loadFirestore();
  const profileRef = doc(db, userCollection, profile.uid);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    const profileData = {
      ...profile,
      handle: normalizeHandle(profile.username),
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
        handle: normalizeHandle(profile.username),
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
