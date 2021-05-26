import { ArchiveKind } from 'common';

export const SELECT_TAB = 'SELECT_TAB';

export interface SelectTab {
    type: typeof SELECT_TAB;
    kind: ArchiveKind;
}

export type HomeAction = SelectTab;

export const HomeActions = {
    selectTab: (kind: ArchiveKind) => ({
        type: SELECT_TAB,
        kind
    })
}

