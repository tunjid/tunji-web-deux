import { MODIFY_APP_BAR, PersistentUiAction } from '../actions/PersistentUi';
import { MenuRes } from "../types/MenuRes";

export interface AppTab {
    index: number
    text: string
    route: string
}

const tabs = [
    {index: 0, text: 'Posts', route: 'posts'},
    {index: 1, text: 'Projects', route: 'projects'},
    {index: 2, text: 'Talks', route: 'talks'},
    {index: 2, text: 'About', route: 'about'},
]

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
    selectedTab: tabs[0],
    tabs: tabs,
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
