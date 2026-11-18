import { loadFirestore } from "./firestoreClient";

// The feed keeps the latest posts in memory and the pages are made from them.
const feedSize = 200;

export interface FeedPost {
  id: string;
  uid: string;
  author: string;
  handle: string;
  text: string;
  imageURL?: string;
  createdAt: Date | null;
}

export interface NewPost {
  uid: string;
  author: string;
  handle: string;
  text: string;
  imageURL: string | null;
}

// Converts a Firestore post document into a FeedPost (used by every post list).
export const toFeedPost = (id: string, data: Record<string, unknown>): FeedPost => {
  const createdAt = data.createdAt as { toDate?: () => Date } | undefined;

  return {
    id,
    uid: String(data.uid || ""),
    author: String(data.author || "Usuario"),
    handle: String(data.handle || "@usuario"),
    text: String(data.text || ""),
    imageURL: typeof data.imageURL === "string" ? data.imageURL : undefined,
    createdAt: typeof createdAt?.toDate === "function" ? createdAt.toDate() : null,
  };
};

export const publishPost = async ({ imageURL, ...post }: NewPost) => {
  const { addDoc, collection, db, serverTimestamp } = await loadFirestore();

  // The image field is only saved when the post has an image.
  await addDoc(collection(db, "posts"), {
    ...post,
    ...(imageURL ? { imageURL } : {}),
    createdAt: serverTimestamp(),
  });
};

export const watchFeed = async (
  onChange: (posts: FeedPost[]) => void,
  onError: (error: Error) => void,
) => {
  const { collection, db, limit, onSnapshot, orderBy, query } =
    await loadFirestore();

  return onSnapshot(
    query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(feedSize)),
    (snapshot) => onChange(snapshot.docs.map((post) => toFeedPost(post.id, post.data()))),
    onError,
  );
};
