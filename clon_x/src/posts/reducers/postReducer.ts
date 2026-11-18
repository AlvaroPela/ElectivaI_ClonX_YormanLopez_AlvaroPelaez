import type {
  PostReducerAction,
  PostState,
} from "../types/postReducerInterfaces";
import { ACTION_TYPES } from "./actionTypes";

export const postReducer = (
  state: PostState,
  action: PostReducerAction,
): PostState => {
  switch (action.type) {
    case ACTION_TYPES.save:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };

    default:
      return state;
  }
};
