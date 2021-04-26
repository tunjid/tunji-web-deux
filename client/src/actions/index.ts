import { ArchiveAction } from "./Archive";
import { PersistentUiAction } from "./PersistentUi";
import { AuthAction } from "./Auth";
import { HomeAction } from "./Home";
import { ThunkAction } from "redux-thunk";
import { StoreState } from "../types";
import { RouterAction } from "./Router";
import { SnackbarAction } from "./Snackbar";

type SynchronousAppActions =
    ArchiveAction | HomeAction | AuthAction |
    PersistentUiAction | RouterAction | SnackbarAction;

const APP_THUNK = 'APP_THUNK';
export interface AppThunk extends ThunkAction<void, StoreState, unknown, SynchronousAppActions> {
    type?: typeof APP_THUNK
}

export type AppAction = SynchronousAppActions | AppThunk;
