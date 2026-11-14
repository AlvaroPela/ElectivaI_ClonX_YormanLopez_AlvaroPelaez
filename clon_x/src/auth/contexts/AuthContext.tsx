import { createContext } from "react";
import type { AuthState } from "../types/authReducerInterfaces";

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  phone: string;
}

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updatePhotoURL: (photoURL: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);