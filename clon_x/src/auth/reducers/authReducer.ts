import type { AuthReducerAction, AuthState } from "../types/authReducerInterfaces";

export const authReducer = (state: AuthState, action: AuthReducerAction) => {

    switch (action.type) {
        case "login":
            return {
                ...state,
                logged: true,
                user: action.payload.user
            }
        case "logout":
            return {
                ...state,
                ...action.payload
            }

        default:
            return state;


    }
}