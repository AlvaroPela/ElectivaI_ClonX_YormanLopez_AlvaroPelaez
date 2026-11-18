import {
  onAuthStateChanged,
  signOut,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";
import { FirebaseAuth } from "../../firebase/config";
import {
  loginUserByCredentials,
  loginUserByGoogleProvider,
  registerUserByCredentials,
} from "../../firebase/providers";
import {
  ensureProfile,
  findEmailByUsername,
  isUsernameAvailable,
  isValidUsername,
  normalizeUsername,
  saveProfile,
} from "../../firebase/profiles";
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

const getEmailName = (user: FirebaseUser) =>
  user.email?.split("@")[0] || "usuario";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const toAuthUser = (user: FirebaseUser, username: string): AuthUser => ({
  uid: user.uid,
  email: user.email || "",
  photoURL: user.photoURL,
  fullName: user.displayName || getEmailName(user),
  username,
});

// Logs the user in with the username saved in its Firestore profile.
// If the profile can't be read, the session still starts with a temporary username.
const startSession = async (
  firebaseUser: FirebaseUser,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  try {
    const profile = await ensureProfile({
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      username: getEmailName(firebaseUser),
      photoURL: firebaseUser.photoURL,
      // Google accounts bring the full name; Firestore doesn't accept undefined.
      ...(firebaseUser.displayName ? { firstName: firebaseUser.displayName } : {}),
    });
    dispatch({
      type: ACTION_TYPES.login,
      payload: toAuthUser(firebaseUser, profile.handle),
    });
  } catch (error) {
    dispatch({
      type: ACTION_TYPES.login,
      payload: toAuthUser(firebaseUser, getEmailName(firebaseUser)),
    });
    dispatch({
      type: ACTION_TYPES.error,
      payload: getErrorMessage(error, "No se pudo cargar el perfil de Firestore."),
    });
  }
};

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// The login form accepts an email or a username; returns the email to log in with.
const resolveLoginEmail = async (identifier: string): Promise<string | null> => {
  if (emailPattern.test(identifier)) return identifier;

  try {
    return await findEmailByUsername(identifier);
  } catch {
    return null;
  }
};

// Returns an error message when the username can't be used, or null when it is free.
const validateUsername = async (username: string): Promise<string | null> => {
  if (!isValidUsername(username)) {
    return "El usuario debe tener entre 3 y 15 caracteres: letras, números o guion bajo.";
  }

  try {
    const available = await isUsernameAvailable(username);
    return available ? null : "Ese nombre de usuario ya está en uso.";
  } catch {
    return "No se pudo validar el nombre de usuario. Inténtalo de nuevo.";
  }
};

// Creates the Firebase account, logs the user in and saves the profile with its username.
const createAccount = async (
  data: RegisterData,
  dispatch: Dispatch<AuthReducerAction>,
): Promise<boolean> => {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const username = normalizeUsername(data.username);
  const result = await registerUserByCredentials(
    data.email,
    data.password,
    fullName,
  );

  if (!result.ok) {
    dispatch({ type: ACTION_TYPES.error, payload: result.errorMessage });
    return false;
  }

  const user: AuthUser = {
    uid: result.uid,
    email: result.email,
    photoURL: result.photoURL,
    fullName,
    username,
  };
  dispatch({ type: ACTION_TYPES.login, payload: user });

  try {
    await saveProfile({
      uid: result.uid,
      email: result.email,
      username,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      birthdate: data.birthdate,
      photoURL: result.photoURL,
    });
  } catch (error) {
    dispatch({
      type: ACTION_TYPES.error,
      payload: getErrorMessage(error, "No se pudo guardar el perfil en Firestore."),
    });
  }

  return true;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  // While an account is being registered, register() saves the profile with the
  // chosen username, so the auth listener must not create a default one.
  const registeringRef = useRef(false);

  useEffect(() => {
    return onAuthStateChanged(FirebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch({ type: ACTION_TYPES.logout });
        return;
      }

      if (registeringRef.current) return;

      await startSession(firebaseUser, dispatch);
    });
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    dispatch({ type: ACTION_TYPES.loading });
    const email = await resolveLoginEmail(identifier);

    if (!email) {
      dispatch({
        type: ACTION_TYPES.error,
        payload: "No existe una cuenta con ese nombre de usuario.",
      });
      return false;
    }

    const result = await loginUserByCredentials(email, password);

    if (!result.ok || !FirebaseAuth.currentUser) {
      const errorMessage = result.ok ? "No se pudo iniciar sesión." : result.errorMessage;
      dispatch({ type: ACTION_TYPES.error, payload: errorMessage });
      return false;
    }

    await startSession(FirebaseAuth.currentUser, dispatch);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const result = await loginUserByGoogleProvider();

    if (!result.ok || !FirebaseAuth.currentUser) {
      const action: AuthReducerAction = {
        type: ACTION_TYPES.error,
        payload: result.ok ? "No se pudo iniciar sesión." : result.errorMessage,
      };

      dispatch(action);

      return false;
    }

    await startSession(FirebaseAuth.currentUser, dispatch);

    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: ACTION_TYPES.loading });
    const usernameError = await validateUsername(data.username);

    if (usernameError) {
      dispatch({ type: ACTION_TYPES.error, payload: usernameError });
      return false;
    }

    registeringRef.current = true;
    const created = await createAccount(data, dispatch);
    registeringRef.current = false;

    return created;
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: ACTION_TYPES.loading });
    try {
      await signOut(FirebaseAuth);
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.error,
        payload: getErrorMessage(error, "No se pudo cerrar sesión."),
      });
      throw error;
    }
  };

  const updatePhotoURL = async (photoURL: string): Promise<void> => {
    const firebaseUser = FirebaseAuth.currentUser;
    if (!firebaseUser || !authState.user) {
      throw new Error("Debes iniciar sesión para cambiar tu foto de perfil.");
    }

    await updateFirebaseProfile(firebaseUser, { photoURL });
    dispatch({
      type: ACTION_TYPES.login,
      payload: { ...authState.user, photoURL },
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
