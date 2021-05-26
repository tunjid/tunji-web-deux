import { AuthAction, SET_USER } from "../actions/Auth";
import { UserLike } from 'common';

export interface AuthState {
    signedInUser?: UserLike;
}

export function authReducer(state = {
}, action: AuthAction): AuthState {
    switch (action.type) {
        case SET_USER: {
            return {
                ...state,
                signedInUser: action.user,
            }
        }
    }
    return state;
}
