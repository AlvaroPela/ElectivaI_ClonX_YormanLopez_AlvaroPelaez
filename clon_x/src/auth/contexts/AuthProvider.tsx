import {
  onAuthStateChanged,
  signOut,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import { useEffect, useReducer, type ReactNode } from "react";
import { FirebaseAuth } from "../../firebase/config";
import {
  loginUserByCredentials,
  loginUserByGoogleProvider,
  registerUserByCredentials,
} from "../../firebase/providers";
import { ensureProfile, saveProfile } from "../../firebase/profiles";
import { AuthContext, type RegisterData } from "./AuthContext";
import { ACTION_TYPES } from "../reducers/actionTypes";
import { authReducer } from "../reducers/authReducer";
import type {
  AuthReducerAction,
  AuthState,
  AuthUser,
} from "../types/authReducerInterfaces";

const initialState: AuthState = {
  logged: false,
  user: null,
  errorMessage: null,
  loading: true,
};

interface AuthProviderProps {
  children: ReactNode;
}

const toAuthUser = (
  user: NonNullable<typeof FirebaseAuth.currentUser>,
): AuthUser => ({
  uid: user.uid,
  email: user.email || "",
  photoURL: user.photoURL,
  username: user.displayName || user.email?.split("@")[0] || "usuario",
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    return onAuthStateChanged(FirebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch({ type: ACTION_TYPES.logout });
        return;
      }

      const user = toAuthUser(firebaseUser);
      dispatch({ type: ACTION_TYPES.login, payload: user });

      try {
        await ensureProfile({
          uid: user.uid,
          email: user.email,
          username: user.username,
          photoURL: user.photoURL,
        });
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.error,
          payload:
            error instanceof Error
              ? error.message
              : "No se pudo guardar el perfil en Firestore.",
        });
      }
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: ACTION_TYPES.loading });
    const result = await loginUserByCredentials(email, password);

    if (!result.ok) {
      dispatch({ type: ACTION_TYPES.error, payload: result.errorMessage });
      return false;
    }

    dispatch({
      type: ACTION_TYPES.login,
      payload: {
        uid: result.uid,
        email: result.email,
        photoURL: result.photoURL,
        username: result.displayName || result.email.split("@")[0],
      },
    });
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const result = await loginUserByGoogleProvider();

    if (!result.ok) {
      const action: AuthReducerAction = {
        type: ACTION_TYPES.error,
        payload: result.errorMessage,
      };

      dispatch(action);

      return false;
    }

    const { uid, displayName, email, photoURL } = result;

    const user: AuthUser = {
      uid,
      email,
      photoURL,
      username: displayName || email.split("@")[0],
    };

    const action: AuthReducerAction = {
      type: ACTION_TYPES.login,
      payload: user,
    };

    dispatch(action);

    return true;
  };

  const register =async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: ACTION_TYPES.loading });
    const displayName = `${data.firstName} ${data.lastName}`.trim();
    const result = await registerUserByCredentials(
      data.email,
      data.password,
      displayName,
    );

    if (!result.ok) {
      dispatch({ type: ACTION_TYPES.error, payload: result.errorMessage });
      return false;
    }

    const user: AuthUser = {
      uid: result.uid,
      email: result.email,
      photoURL: result.photoURL,
      username: displayName,
    };
    dispatch({ type: ACTION_TYPES.login, payload: user });

    try {
      await saveProfile({
        uid: result.uid,
        email: result.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        birthdate: data.birthdate,
        photoURL: result.photoURL,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.error,
        payload:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el perfil en Firestore.",
      });
    }
    return true;
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: ACTION_TYPES.loading });
    try {
      await signOut(FirebaseAuth);
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.error,
        payload:
          error instanceof Error ? error.message : "No se pudo cerrar sesión.",
      });
      throw error;
    }
  };

  const updatePhotoURL = async (photoURL: string): Promise<void> => {
    const firebaseUser = FirebaseAuth.currentUser;
    if (!firebaseUser) {
      throw new Error("Debes iniciar sesión para cambiar tu foto de perfil.");
    }

    await updateFirebaseProfile(firebaseUser, { photoURL });
    dispatch({
      type: ACTION_TYPES.login,
      payload: { ...toAuthUser(firebaseUser), photoURL },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        loginWithGoogle,
        register,
        logout,
        updatePhotoURL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
