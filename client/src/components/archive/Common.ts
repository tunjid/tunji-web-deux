import { ArchiveKind, ArchiveLike, UserLike } from "../../common/Models";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveState } from "../../reducers/Archive";
import { ArchiveView } from "../../actions/Archive";

export interface ArchiveProps {
    isSignedIn: boolean;
    kind: ArchiveKind;
    archiveId: string;
    archive: ArchiveLike;
}

export const archiveSelector:
    (archiveViewType: ArchiveView) => OutputSelector<StoreState, ArchiveProps, (a: UserLike, b: string[], c: ArchiveState) => ArchiveProps>
    = (archiveViewType) => createSelector(
    state => state.auth.signedInUser,
    state => state.router.location.pathname.split('/'),
    state => state.archives,
    (signedInUser, pathSegments, archiveState) => {
        const kind = pathSegments[1] as ArchiveKind;
        return {
            isSignedIn: signedInUser !== undefined,
            kind,
            archiveId: pathSegments[2],
            archive: archiveViewType === 'detail' ? archiveState.kindToDetailMap[kind] : archiveState.kindToEditMap[kind]
        };
    }
);

export const readTime = (text: String) => `${Math.ceil(text.trim().split(/\s+/).length / 250)} min read`

export const archiveDate = (date: Date) => date.toDateString().split(' ').splice(1).join(' ')
