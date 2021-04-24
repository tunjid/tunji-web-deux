import { PersistentUiState } from '../reducers/PersistentUi';
import { ArchiveState } from '../reducers/Archive';
import { HomeState } from "../reducers/Home";

export interface StoreState {
    persistentUI: PersistentUiState;
    articles: ArchiveState;
    projects: ArchiveState;
    talks: ArchiveState;
    home: HomeState;
}
