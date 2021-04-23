import { MODIFY_APP_BAR, PersistentUiAction } from '../actions/PersistentUi';
import { MenuRes } from "../types/MenuRes";
import { ArchiveKind } from "./Archive";

export interface AppTab {
    index: number
    text: string
    kind: ArchiveKind
}

const tabs = [
    {index: 0, text: 'Articles', kind: ArchiveKind.Article},
    {index: 1, text: 'Projects', kind: ArchiveKind.Project},
    {index: 2, text: 'Talks', kind: ArchiveKind.Talk},
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
