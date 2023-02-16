import { PersistentUiState } from '../reducers/PersistentUi';
import { ArchiveState } from '../reducers/Archive';
import { HomeState } from "../reducers/Home";
import { AuthState } from "../reducers/Auth";
import { RouterState } from "connected-react-router";
import { SnackbarState } from "../reducers/Snackbar";
import { OpenGraphState } from '@tunji-web/client/src/reducers/OpenGraph';
import { DetailState } from '@tunji-web/client/src/reducers/Detail';

export interface StoreState {
    persistentUI: PersistentUiState;
    archives: ArchiveState;
    home: HomeState;
    detail: DetailState,
    auth: AuthState;
    openGraph: OpenGraphState,
    snackbars: SnackbarState,
    router: RouterState
}
