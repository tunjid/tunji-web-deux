import { MODIFY_APP_BAR, PersistentUiAction } from '../actions/PersistentUi';
import { MenuRes } from "../types/MenuRes";

export interface PersistentUiState {
    appBarTitle: string;
    appBarColor: string;
    hasAppBarSpacer: boolean;
    hasAppBarShadow: boolean;
    hasAppBarHeader: boolean;
    tabsShow: boolean;
    menuItems: MenuRes[];
    anchorEl?: HTMLElement;
    fab?: MenuRes;
}

export function persistentUiReducer(state = {
    appBarTitle: 'Adetunji Dahunsi',
    appBarColor: "#00000000",
    hasAppBarSpacer: false,
    hasAppBarShadow: false,
    hasAppBarHeader: true,
    tabsShow: true,
    menuItems: [] as MenuRes[],
}, action: PersistentUiAction): PersistentUiState {
    switch (action.type) {
        case MODIFY_APP_BAR: {
            return {
                ...state,
                ...action.payload,
            }
        }
    }
    return state;
}
