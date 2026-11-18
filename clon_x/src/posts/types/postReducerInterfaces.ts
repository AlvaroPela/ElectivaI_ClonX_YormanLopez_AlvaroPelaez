export interface PostState {
  posts: Post[];
}

export interface Post {
  uid: string;
  author: string;
  handle: string;
  text: string;
  createdAt: Date;
}

export interface PostReducerAction {
  type: ActionType;
  payload: Post;
}

export type ActionType = "save";
