import { PersistentUiState } from "../reducers/PersistentUi";

export const MODIFY_APP_BAR = 'MODIFY_APP_BAR';

export interface ModifyAppBar {
    type: typeof MODIFY_APP_BAR;
    payload: Partial<PersistentUiState>;
}

export type AppBarAction = ModifyAppBar;

export type PersistentUiAction = AppBarAction;

export const PersistentUiActions = {
    modifyAppBar: (payload: Partial<PersistentUiState>) => ({
        type: MODIFY_APP_BAR,
        payload
    })
}
