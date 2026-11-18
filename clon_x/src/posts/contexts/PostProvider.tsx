import { collection, doc, setDoc } from "firebase/firestore";
import { useReducer, type ReactNode } from "react";
import { FirebaseDB } from "../../firebase/config";
import { ACTION_TYPES } from "../reducers/actionTypes";
import { postReducer } from "../reducers/postReducer";
import type {
  Post,
  PostReducerAction,
  PostState,
} from "../types/postReducerInterfaces";
import { PostContext } from "./PostContext";

interface PostProviderProps {
  children: ReactNode;
}

const initialState: PostState = {
  posts: [],
};

export const PostProvider = ({ children }: PostProviderProps) => {
  const [postState, dispatch] = useReducer(postReducer, initialState);

  const savePost = async (post: Post): Promise<boolean> => {
    try {
      const postCollection = collection(FirebaseDB, "posts");
      const newDoc = doc(postCollection);

      await setDoc(newDoc, post); // save in Firestore

      const action: PostReducerAction = {
        type: ACTION_TYPES.save,
        payload: post,
      };

      dispatch(action);

      return true;
    } catch {
      return false;
    }
  };

  return (
    <PostContext.Provider value={{ postState, savePost }}>
      {children}
    </PostContext.Provider>
  );
};
