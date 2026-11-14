import {
  onAuthStateChanged,
  signOut,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import { useEffect, useReducer, type ReactNode } from "react";
import { FirebaseAuth } from "../../firebase/config";
import {
  loginUserByCredentials,
  registerUserByCredentials,
} from "../../firebase/providers";
import { ensureProfile, saveProfile } from "../../firebase/profiles";
import { AuthContext, type RegisterData } from "./AuthContext";
import { authReducer } from "../reducers/authReducer";
import type { AuthState, AuthUser } from "../types/authReducerInterfaces";

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
        dispatch({ type: "unauthenticated" });
        return;
      }

      const user = toAuthUser(firebaseUser);
      dispatch({ type: "authenticated", payload: user });

      try {
        await ensureProfile({
          uid: user.uid,
          email: user.email,
          username: user.username,
          photoURL: user.photoURL,
        });
      } catch (error) {
        dispatch({
          type: "error",
          payload:
            error instanceof Error
              ? error.message
              : "No se pudo guardar el perfil en Firestore.",
        });
      }
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "loading" });
    const result = await loginUserByCredentials(email, password);

    if (!result.ok) {
      dispatch({ type: "error", payload: result.errorMessage });
      return false;
    }

    dispatch({
      type: "authenticated",
      payload: {
        uid: result.uid,
        email: result.email,
        photoURL: result.photoURL,
        username: result.displayName || result.email.split("@")[0],
      },
    });
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: "loading" });
    const displayName = `${data.firstName} ${data.lastName}`.trim();
    const result = await registerUserByCredentials(
      data.email,
      data.password,
      displayName,
    );

    if (!result.ok) {
      dispatch({ type: "error", payload: result.errorMessage });
      return false;
    }

    const user: AuthUser = {
      uid: result.uid,
      email: result.email,
      photoURL: result.photoURL,
      username: displayName,
    };
    dispatch({ type: "authenticated", payload: user });

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
        type: "error",
        payload:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el perfil en Firestore.",
      });
    }
    return true;
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: "loading" });
    try {
      await signOut(FirebaseAuth);
    } catch (error) {
      dispatch({
        type: "error",
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
      type: "authenticated",
      payload: { ...toAuthUser(firebaseUser), photoURL },
    });
  };

  return (
    <AuthContext.Provider
      value={{ authState, login, register, logout, updatePhotoURL }}
    >
      {children}
    </AuthContext.Provider>
  );
};
