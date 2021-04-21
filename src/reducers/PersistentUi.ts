import { MODIFY_APP_BAR, PersistentUiAction } from '../actions/PersistentUi';
import { MenuRes } from "../types/MenuRes";

export interface AppTab {
    index: number
    text: string
}

export interface PersistentUiState {
    appBarTitle: string;
    appBarColor: string;
    hasAppBarSpacer: boolean;
    hasAppBarShadow: boolean;
    hasAppBarHeader: boolean;
    tabsShow: boolean;
    tabs: AppTab[];
    selectedTab: AppTab;
    menuItems: MenuRes[];
    anchorEl?: HTMLElement;
    menuClickListener?: (clicked: MenuRes) => void;
}

export function persistentUiReducer(state = {
    appBarTitle: 'Adetunji Dahunsi',
    appBarColor: "#00000000",
    hasAppBarSpacer: false,
    hasAppBarShadow: false,
    hasAppBarHeader: true,
    tabsShow: true,
    selectedTab: {index: 0, text: 'Posts'},
    tabs: [
        {index: 0, text: 'Posts'},
        {index: 1, text: 'Projects'},
        {index: 2, text: 'Talks'},
        {index: 2, text: 'About'},
    ],
    menuItems: [{text: 'About'}, {text: 'Features'}],
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
