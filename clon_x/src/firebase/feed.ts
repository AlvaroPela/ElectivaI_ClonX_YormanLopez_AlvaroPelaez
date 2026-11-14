import { loadFirestore } from "./firestoreClient";

export interface FeedPost {
  id: string;
  uid: string;
  author: string;
  handle: string;
  text: string;
  createdAt: Date | null;
}

export const publishPost = async (
  uid: string,
  author: string,
  handle: string,
  text: string,
) => {
  const { addDoc, collection, db, serverTimestamp } = await loadFirestore();
  await addDoc(collection(db, "posts"), {
    uid,
    author,
    handle,
    text,
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
    query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50)),
    (snapshot) => {
      onChange(
        snapshot.docs.map((post) => {
          const data = post.data();
          return {
            id: post.id,
            uid: String(data.uid || ""),
            author: String(data.author || "Usuario"),
            handle: String(data.handle || "@usuario"),
            text: String(data.text || ""),
            createdAt:
              data.createdAt && typeof data.createdAt.toDate === "function"
                ? data.createdAt.toDate()
                : null,
          };
        }),
      );
    },
    onError,
  );
};
