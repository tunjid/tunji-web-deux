import { UserLike } from "../../../common/Models";
import { ThunkAction } from "redux-thunk";
import { StoreState } from "../types";
import axios from "axios";

export const SET_USER = 'SET_USER';

export interface SetUser {
    type: typeof SET_USER;
    user: UserLike;
}

interface SignInArgs {
    username: string;
    password: string;
}

export type AuthAction = SetUser;

interface IAuthActions {
    signIn: (args: SignInArgs) => ThunkAction<void, StoreState, unknown, SetUser>
    setUser: (user: UserLike) => SetUser
}

export const AuthActions: IAuthActions = {
    signIn: (args: SignInArgs) => async (dispatch) => {
        const response = await axios.post<UserLike>(`/api/sign-in`, args);
        const status = response.status;
        console.log(`SIGN IN: ${JSON.stringify(response)}`);
        if (status < 200 || status > 399) return;

        dispatch(AuthActions.setUser(response.data));
    },
    setUser: (user: UserLike) => ({
        type: SET_USER,
        user
    })
}

