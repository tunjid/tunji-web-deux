import { PersistentUiState } from '../reducers/PersistentUi';
import { ArchiveState } from '../reducers/Archive';

export interface StoreState {
    persistentUI: PersistentUiState;
    articles: ArchiveState;
    projects: ArchiveState;
    talks: ArchiveState;
}
