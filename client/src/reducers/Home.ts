import { ArchiveKind } from "./Archive";
import { HomeAction, SELECT_TAB } from "../actions/Home";

export interface HomeTab {
    index: number
    text: string
    kind: ArchiveKind
}

const tabs = [
    {index: 0, text: 'Articles', kind: ArchiveKind.Articles},
    {index: 1, text: 'Projects', kind: ArchiveKind.Projects},
    {index: 2, text: 'Talks', kind: ArchiveKind.Talks},
]

export interface HomeState {
    tabs: HomeTab[];
    selectedTab: HomeTab;
}

export function homeReducer(state = {
    selectedTab: tabs[0],
    tabs: tabs,
}, action: HomeAction): HomeState {
    switch (action.type) {
        case SELECT_TAB: {
            return {
                ...state,
                selectedTab: action.tab,
            }
        }
    }
    return state;
}
