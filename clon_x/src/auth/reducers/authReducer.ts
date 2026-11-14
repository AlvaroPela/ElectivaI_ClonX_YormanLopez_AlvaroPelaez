import type {
  AuthReducerAction,
  AuthState,
} from "../types/authReducerInterfaces";

export const authReducer = (
  state: AuthState,
  action: AuthReducerAction,
): AuthState => {
  switch (action.type) {
    case "loading":
      return { ...state, errorMessage: null, loading: true };
    case "authenticated":
      return {
        logged: true,
        user: action.payload,
        errorMessage: null,
        loading: false,
      };
    case "unauthenticated":
      return {
        logged: false,
        user: null,
        errorMessage: null,
        loading: false,
      };
    case "error":
      return { ...state, errorMessage: action.payload, loading: false };
    case "clearError":
      return { ...state, errorMessage: null };
    default:
      return state;
  }
};
