import { PersistentUiState } from "../reducers/PersistentUi";
import { ProjectsState } from "../reducers/Projects";

export interface StoreState {
    persistentUI: PersistentUiState;
    projects: ProjectsState;
}
