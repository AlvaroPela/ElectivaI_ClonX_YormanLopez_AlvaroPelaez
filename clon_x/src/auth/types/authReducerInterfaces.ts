export interface AuthState {
logged: boolean;
user: User | null;
}

export interface User {
username: string;
email: string;
}

export interface AuthReducerAction {
    type: ActionType;
    payload: AuthState;
}

export type ActionType = 'login' | 'logout';