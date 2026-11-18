import { toFeedPost, type FeedPost } from "./feed";
import { loadFirestore } from "./firestoreClient";
import { normalizeUsername, parseProfile, type Profile } from "./profiles";

// Name shown in lists and pages: the full name, or the username if there is none.
export const getDisplayName = (profile: Profile) =>
  `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.username;

export const sortByDisplayName = (profiles: Profile[]) =>
  [...profiles].sort((first, second) =>
    getDisplayName(first).localeCompare(getDisplayName(second), "es", {
      sensitivity: "base",
    }),
  );

const getProfileById = async (uid: string): Promise<Profile | null> => {
  const { db, doc, getDoc } = await loadFirestore();
  const snapshot = await getDoc(doc(db, "users", uid));

  return snapshot.exists() ? parseProfile(snapshot.id, snapshot.data()) : null;
};

// Finds a profile by its username or by its uid (posts link to the uid).
// Old accounts may not have a reserved username, so it also searches by handle.
export const findProfileByUsername = async (
  username: string,
): Promise<Profile | null> => {
  const { collection, db, doc, getDoc, getDocs, limit, query, where } =
    await loadFirestore();
  const handle = normalizeUsername(username);
  const usernameSnapshot = await getDoc(doc(db, "usernames", handle));
  const reservedUid = usernameSnapshot.data()?.uid;

  if (reservedUid) return getProfileById(String(reservedUid));

  const result = await getDocs(
    query(collection(db, "users"), where("handle", "==", handle), limit(1)),
  );
  const userDocument = result.docs[0];
  if (userDocument) return parseProfile(userDocument.id, userDocument.data());

  return getProfileById(username.trim());
};

export const getProfilesByIds = async (ids: string[]): Promise<Profile[]> => {
  const { db, doc, getDoc } = await loadFirestore();
  const snapshots = await Promise.all(ids.map((id) => getDoc(doc(db, "users", id))));

  return snapshots
    .filter((snapshot) => snapshot.exists())
    .map((snapshot) => parseProfile(snapshot.id, snapshot.data() ?? {}));
};

// Ids of the accounts that follow the user (the followers list).
export const watchFollowerIds = async (
  uid: string,
  onChange: (ids: string[]) => void,
  onError: (error: Error) => void,
) => {
  const { collection, db, onSnapshot, query, where } = await loadFirestore();

  return onSnapshot(
    query(collection(db, "follows"), where("followingId", "==", uid)),
    (snapshot) => onChange(snapshot.docs.map((follow) => String(follow.data().followerId))),
    onError,
  );
};

// Posts of one user, from the most recent to the oldest. They are sorted here
// instead of with orderBy so Firestore doesn't need a composite index.
export const watchUserPosts = async (
  uid: string,
  onChange: (posts: FeedPost[]) => void,
  onError: (error: Error) => void,
) => {
  const { collection, db, onSnapshot, query, where } = await loadFirestore();

  return onSnapshot(
    query(collection(db, "posts"), where("uid", "==", uid)),
    (snapshot) => {
      const posts = snapshot.docs.map((post) => toFeedPost(post.id, post.data()));
      onChange(posts.sort(byNewest));
    },
    onError,
  );
};

const byNewest = (first: FeedPost, second: FeedPost) =>
  (second.createdAt?.getTime() ?? Date.now()) - (first.createdAt?.getTime() ?? Date.now());
