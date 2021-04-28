import { UserLike } from "../common/Models";
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";
import { onSuccessOrSnackbar } from "./Common";

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
        await onSuccessOrSnackbar(
            ApiService.session(),
            dispatch,
            (fetched) => dispatch(AuthActions.setUser(fetched))
        );
    },
    signIn: (args: SignInArgs) => async (dispatch) => {
        await onSuccessOrSnackbar(
            ApiService.signIn(args),
            dispatch,
            (fetched) => dispatch(AuthActions.setUser(fetched))
        );
    },
    setUser: (user: UserLike) => ({
        type: SET_USER,
        user
    })
}

