import { ArchiveKind, ArchiveLike, UserLike } from "../../common/Models";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveState } from "../../reducers/Archive";
import { ArchiveView } from "../../actions/Archive";
import { Theme } from "@material-ui/core";

export const responsiveWidth = (theme: Theme) => ({
    [theme.breakpoints.up('md')]: {
        width: '50vw',
    },
    width: '80vw',
});

export interface ArchiveResourceProps {
    isSignedIn: boolean;
    kind: ArchiveKind;
    archiveId?: string;
    archive?: ArchiveLike;
}

export const archiveSelector = (archiveViewType: ArchiveView) => createSelector<StoreState, UserLike | undefined, string, ArchiveState, ArchiveResourceProps>(
    state => state.auth.signedInUser,
    state => state.router.location.pathname,
    state => state.archives,
    (signedInUser, pathname, archiveState) => {
        const pathSegments = pathname.split('/').filter(segment => segment !== 'edit');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const linkSplit = lastSegment.split('-');
        const kind = pathSegments[1] as ArchiveKind;
        const archiveId = linkSplit[linkSplit.length - 1];

        return {
            isSignedIn: signedInUser !== undefined,
            kind,
            archiveId,
            archive: archiveViewType === 'detail' ? archiveState.kindToDetailMap[kind] : archiveState.kindToEditMap[kind]
        };
    }
);

export const readTime = (text: String) => `${Math.ceil(text.trim().split(/\s+/).length / 250)} min read`

export const archiveDate = (date: Date) => date.toDateString().split(' ').splice(1).join(' ');

export const ShortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

