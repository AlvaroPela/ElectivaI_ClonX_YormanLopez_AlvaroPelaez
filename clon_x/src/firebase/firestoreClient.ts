import { FirebaseApp } from "./config";

export const loadFirestore = async () => {
  const firestore = await import("firebase/firestore");

  return {
    addDoc: firestore.addDoc,
    collection: firestore.collection,
    doc: firestore.doc,
    db: firestore.getFirestore(FirebaseApp),
    getDocs: firestore.getDocs,
    limit: firestore.limit,
    onSnapshot: firestore.onSnapshot,
    orderBy: firestore.orderBy,
    query: firestore.query,
    runTransaction: firestore.runTransaction,
    serverTimestamp: firestore.serverTimestamp,
    setDoc: firestore.setDoc,
    where: firestore.where,
  };
};
