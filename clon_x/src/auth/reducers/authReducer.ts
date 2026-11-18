import type {
  AuthReducerAction,
  AuthState,
} from "../types/authReducerInterfaces";
import { ACTION_TYPES } from "./actionTypes";

export const authReducer = (
  state: AuthState,
  action: AuthReducerAction,
): AuthState => {
  switch (action.type) {
    case ACTION_TYPES.loading:
      return { ...state, errorMessage: null, loading: true };
    case ACTION_TYPES.login:
      return {
        logged: true,
        user: action.payload,
        errorMessage: null,
        loading: false,
      };
    case ACTION_TYPES.logout:
      return {
        logged: false,
        user: null,
        errorMessage: null,
        loading: false,
      };
    case ACTION_TYPES.error:
      return { ...state, errorMessage: action.payload, loading: false };
    case ACTION_TYPES.clearError:
      return { ...state, errorMessage: null };
    default:
      return state;
  }
};
