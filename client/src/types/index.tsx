import { PersistentUiState } from '../reducers/PersistentUi';
import { ArchiveState } from '../reducers/Archive';
import { HomeState } from "../reducers/Home";
import { AuthState } from "../reducers/Auth";
import { RouterState } from "connected-react-router";

export interface StoreState {
    persistentUI: PersistentUiState;
    archives: ArchiveState;
    home: HomeState;
    auth: AuthState;
    router: RouterState
}
