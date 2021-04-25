import { ArchiveKind, UserLike } from "../../common/Models";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";

export interface ArchiveProps {
    isSignedIn: boolean;
    kind: ArchiveKind;
    archiveId: string
}

export const archiveSelector: OutputSelector<StoreState, ArchiveProps, (a: UserLike, b: string[]) => ArchiveProps> = createSelector(
    state => state.auth.signedInUser,
    state => state.router.location.pathname.split('/'),
    (signedInUser, pathSegments) => ({
        isSignedIn: signedInUser !== undefined,
        kind: pathSegments[1] as ArchiveKind,
        archiveId: pathSegments[2],
    })
);
