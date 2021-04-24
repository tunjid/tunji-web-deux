import { UserLike } from "../../../common/Models";

export const SET_USER = 'SET_USER';

export interface SetUser {
    type: typeof SET_USER;
    user: UserLike;
}

export type AuthAction = SetUser;

export const AuthActions = {
    selectTab: (user: UserLike) => ({
        type: SET_USER,
        user
    })
}

