import { PersistentUiState } from "../reducers/PersistentUi";

export const MODIFY_APP_BAR = 'MODIFY_APP_BAR';

export interface ModifyAppBar {
    type: typeof MODIFY_APP_BAR;
    payload: Partial<PersistentUiState>;
}

export type AppBarAction = ModifyAppBar;

export type PersistentUiAction = AppBarAction;

export function modifyAppBar(payload: Partial<PersistentUiState>): ModifyAppBar {
    return {
        type: MODIFY_APP_BAR,
        payload
    }
}
