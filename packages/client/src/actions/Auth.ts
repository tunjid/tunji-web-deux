import { UserLike } from '@tunji-web/common';
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";
import { RouterActions } from "./Router";
import { onHttpResponse, onSuccessOrSnackbar } from "./Common";

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
        await onHttpResponse(
            ApiService.session(),
            (fetched) => dispatch(AuthActions.setUser(fetched))
        );
    },
    signIn: (args: SignInArgs) => async (dispatch) => {
        await onSuccessOrSnackbar(
            ApiService.signIn(args),
            dispatch,
            (fetched) => {
                dispatch(AuthActions.setUser(fetched));
                dispatch(RouterActions.push('/'));
            }
        );
    },
    setUser: (user: UserLike) => ({
        type: SET_USER,
        user
    })
}

