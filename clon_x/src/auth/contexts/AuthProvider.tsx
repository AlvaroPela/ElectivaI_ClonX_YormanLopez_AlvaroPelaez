import { AuthContext } from "./AuthContext";
import { authReducer } from "../reducers/authReducer";
import { useReducer, type ReactNode } from "react";
import type { AuthReducerAction, AuthState } from "../types/authReducerInterfaces";
import { loginUserByCredentials } from "../../firebase/providers";
import type { User } from "firebase/auth";

const initialState = {
    logged: false,
    user: null
}as AuthState;

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {

    const [authState, dispatch] = useReducer(authReducer, initialState);

    const login = async (email: string, password: string): Promise<boolean> => {

    const { ok, uid, displayName, photoURL, errorMessage } =
        await loginUserByCredentials(email, password);

    if (ok) {
        const user = {
            uid,
            email,
            photoURL,
            username: displayName
        }
        const action = {
            type: "login",
            payload: {
                logged: true,
                user,
            },
        } as AuthReducerAction;

        dispatch(action);
        return true;
    } else {
        const action = {
            type: 'error',
            payload: {
                logged: false,
                user: null,
                errorMessage: null,
            }
        } as AuthReducerAction;

        dispatch(action);
        return false;
    }
};

    const logout = () : boolean => {
        dispatch({
            type: "logout",
            payload: {
                logged: false,
                user: null,
                errorMessage: null,
            }
        });
        return true;
    }

    return (
        <AuthContext.Provider value={{authState, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}