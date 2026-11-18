import { loadFirestore } from "./firestoreClient";

export interface PostComment {
  id: string;
  uid: string;
  author: string;
  handle: string;
  text: string;
  createdAt: Date | null;
}

export interface NewComment {
  uid: string;
  author: string;
  handle: string;
  text: string;
}

// Comments are saved in a subcollection of each post: posts/{postId}/comments.
const commentsPath = (postId: string) => ["posts", postId, "comments"] as const;

export const addComment = async (postId: string, comment: NewComment) => {
  const { addDoc, collection, db, serverTimestamp } = await loadFirestore();

  await addDoc(collection(db, ...commentsPath(postId)), {
    ...comment,
    createdAt: serverTimestamp(),
  });
};

// Comments of a post from the oldest to the newest, updated in real time.
export const watchComments = async (
  postId: string,
  onChange: (comments: PostComment[]) => void,
  onError: (error: Error) => void,
) => {
  const { collection, db, onSnapshot, orderBy, query } = await loadFirestore();

  return onSnapshot(
    query(collection(db, ...commentsPath(postId)), orderBy("createdAt", "asc")),
    (snapshot) => onChange(snapshot.docs.map((comment) => toComment(comment.id, comment.data()))),
    onError,
  );
};

const toComment = (id: string, data: Record<string, unknown>): PostComment => {
  const createdAt = data.createdAt as { toDate?: () => Date } | undefined;

  return {
    id,
    uid: String(data.uid || ""),
    author: String(data.author || "Usuario"),
    handle: String(data.handle || "@usuario"),
    text: String(data.text || ""),
    createdAt: typeof createdAt?.toDate === "function" ? createdAt.toDate() : null,
  };
};
