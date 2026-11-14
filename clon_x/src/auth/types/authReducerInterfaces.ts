export interface AuthUser {
  uid: string;
  email: string;
  photoURL: string | null;
  username: string;
}

export interface AuthState {
  logged: boolean;
  user: AuthUser | null;
  errorMessage: string | null;
  loading: boolean;
}

export type AuthReducerAction =
  | { type: "loading" }
  | { type: "authenticated"; payload: AuthUser }
  | { type: "unauthenticated" }
  | { type: "error"; payload: string }
  | { type: "clearError" };
