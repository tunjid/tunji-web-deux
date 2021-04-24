import { UserLike } from "../../../common/Models";
import { ThunkAction } from "redux-thunk";
import { StoreState } from "../types";
import axios from "axios";

export const SET_USER = 'SET_USER';

export interface SetUser {
    type: typeof SET_USER;
    user: UserLike;
}

export type AuthAction = SetUser;

interface IAuthActions {
    signIn: (username: string, password: string) => ThunkAction<void, StoreState, unknown, SetUser>
    setUser: (user: UserLike) => SetUser
}

export const AuthActions: IAuthActions = {
    signIn: (username: string, password: string) => async (dispatch) => {
        const response = await axios.post<UserLike>(`/api/sign-in`, {username, password});
        const status = response.status;
        if (status < 200 || status > 399) return;

        dispatch(AuthActions.setUser(response.data));
    },
    setUser: (user: UserLike) => ({
        type: SET_USER,
        user
    })
}

