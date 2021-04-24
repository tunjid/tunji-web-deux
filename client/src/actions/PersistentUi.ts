import { PersistentUiState } from "../reducers/PersistentUi";

export const MODIFY_APP_BAR = 'MODIFY_APP_BAR';
export const MENU_ROUTE = 'MENU_ROUTE';

export interface ModifyAppBar {
    type: typeof MODIFY_APP_BAR;
    payload: Partial<PersistentUiState>;
}

export interface MenuRoute {
    type: typeof MENU_ROUTE;
    route: string;
}

export type AppBarAction = ModifyAppBar | MenuRoute;

export type PersistentUiAction = AppBarAction;

interface IPersistentUiActions {
    modifyAppBar: (payload: Partial<PersistentUiState>) => ModifyAppBar
    menuRoute: (route: string) => MenuRoute
}

export const PersistentUiActions: IPersistentUiActions = {
    modifyAppBar: (payload: Partial<PersistentUiState>) => ({
        type: MODIFY_APP_BAR,
        payload
    }),
    menuRoute: (route: string) => ({
        type: MENU_ROUTE,
        route
    })
}
