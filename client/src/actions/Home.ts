import { HomeTab } from "../reducers/Home";

export const SELECT_TAB = 'SELECT_TAB';

export interface SelectTab {
    type: typeof SELECT_TAB;
    tab: HomeTab;
}

export type HomeAction = SelectTab;

export const HomeActions = {
    selectTab: (tab: HomeTab) => ({
        type: SELECT_TAB,
        tab
    })
}

