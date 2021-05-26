import { HomeAction, SELECT_TAB } from "../actions/Home";
import { ArchiveKind } from "common";

export interface HomeState {
    tabs: ArchiveKind[];
    selectedTab: ArchiveKind;
}

export function homeReducer(state = {
    selectedTab: ArchiveKind.Articles,
    tabs: [ArchiveKind.Articles, ArchiveKind.Projects, ArchiveKind.Talks],
}, action: HomeAction): HomeState {
    switch (action.type) {
        case SELECT_TAB: {
            return {
                ...state,
                selectedTab: action.kind,
            }
        }
    }
    return state;
}
