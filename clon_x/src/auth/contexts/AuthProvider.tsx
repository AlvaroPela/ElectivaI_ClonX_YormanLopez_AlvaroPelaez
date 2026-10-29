import { AuthContext } from "./AuthContext";
import { authReducer } from "../reducers/authReducer";
import { useReducer, type ReactNode } from "react";
import type { AuthReducerAction, AuthState } from "../types/authReducerInterfaces";

const initialState = {
    logged: false,
    user: null
}as AuthState;

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {

    const [authState, dispatch] = useReducer(authReducer, initialState);

    const login = (email: string, password: string) : boolean => {
        if (email === "pruebas@pruebas.com" && password === "123456") {
            const action ={
                type: "login",
                payload: {
                    logged: true,
                    user: {
                        username: "pruebas",
                        email: "pruebas@pruebas.com"
                    }
                }
            } as AuthReducerAction;
            dispatch(action);
            return true;
        }
        return false;
    }

    const logout = () : boolean => {
        dispatch({
            type: "logout",
            payload: {
                logged: false,
                user: null
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