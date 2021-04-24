import { UserLike } from "../common/Models";
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";

export const SET_USER = 'SET_USER';

export interface SetUser {
    type: typeof SET_USER;
    user: UserLike;
}

export interface SignInArgs {
    username: string;
    password: string;
}

export type AuthAction = SetUser;

interface IAuthActions {
    fetchSession: () => AppThunk
    signIn: (args: SignInArgs) => AppThunk
    setUser: (user: UserLike) => SetUser
}

export const AuthActions: IAuthActions = {
    fetchSession: () => async (dispatch) => {
        const response = await ApiService.session();
        const status = response.status;
        if (status < 200 || status > 399) return;

        dispatch(AuthActions.setUser(response.data));
    },
    signIn: (args: SignInArgs) => async (dispatch) => {
        const response = await ApiService.signIn(args);
        const status = response.status;
        if (status < 200 || status > 399) return;

        dispatch(AuthActions.setUser(response.data));
    },
    setUser: (user: UserLike) => ({
        type: SET_USER,
        user
    })
}

