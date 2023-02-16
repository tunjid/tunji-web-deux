import { ArchiveAction } from './Archive';
import { PersistentUiAction } from './PersistentUi';
import { AuthAction } from './Auth';
import { HomeAction } from './Home';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { StoreState } from '../types';
import { RouterAction } from './Router';
import { SnackbarAction } from './Snackbar';
import { OpenGraphAction } from '@tunji-web/client/src/actions/OpenGraph';
import { DetailAction } from '@tunji-web/client/src/actions/Detail';

export type SynchronousAppAction =
    ArchiveAction | HomeAction | AuthAction | DetailAction |
    PersistentUiAction | RouterAction | OpenGraphAction |
    SnackbarAction;

const APP_THUNK = 'APP_THUNK';

export interface AppThunk extends ThunkAction<void, StoreState, unknown, SynchronousAppAction> {
    type?: typeof APP_THUNK
}

export interface AppDispatch extends ThunkDispatch<StoreState, unknown, SynchronousAppAction> {

}

export type AppAction = SynchronousAppAction | AppThunk;
