import { createContext } from "react";
import type { Post, PostState } from "../types/postReducerInterfaces";

interface PostContextValueObject {
  postState: PostState;
  savePost: (post: Post) => Promise<boolean>;
}

const defaultValue = {} as PostContextValueObject;

export const PostContext = createContext(defaultValue);
