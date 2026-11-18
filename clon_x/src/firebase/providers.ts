import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { FirebaseAuth } from "./config";

const GoogleProvider = new GoogleAuthProvider();

export interface AuthSuccess {
  ok: true;
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthFailure {
  ok: false;
  errorMessage: string;
}

export type AuthResult = AuthSuccess | AuthFailure;

const toAuthFailure = (error: unknown): AuthFailure => {
  const messages: Record<string, string> = {
    "auth/invalid-credential": "Usuario, correo o contraseña incorrectos.",
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/network-request-failed": "No se pudo conectar. Revisa tu conexión.",
  };
  const errorMessage =
    error instanceof FirebaseError
      ? messages[error.code] || error.message
      : error instanceof Error
        ? error.message
        : "No se pudo completar la operación.";

  return { ok: false, errorMessage };
};

export const loginUserByCredentials = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const { user } = await signInWithEmailAndPassword(
      FirebaseAuth,
      email,
      password,
    );

    return {
      ok: true,
      uid: user.uid,
      email: user.email || email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    return toAuthFailure(error);
  }
};

export const loginUserByGoogleProvider = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(FirebaseAuth, GoogleProvider);

    const { displayName, email, photoURL, uid } = result.user;

    return {
      ok: true,
      uid,
      email: email || "",
      displayName,
      photoURL,
    };
  } catch (error) {
    return toAuthFailure(error);
  }
};

export const registerUserByCredentials = async (
  email: string,
  password: string,
  username: string,
): Promise<AuthResult> => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password,
    );
    await updateProfile(user, { displayName: username });

    return {
      ok: true,
      uid: user.uid,
      email: user.email || email,
      displayName: username,
      photoURL: user.photoURL,
    };
  } catch (error) {
    return toAuthFailure(error);
  }
};
