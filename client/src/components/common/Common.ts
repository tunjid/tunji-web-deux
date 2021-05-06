import { ArchiveKind, ArchiveLike, UserLike } from "../../client-server-common/Models";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveState } from "../../reducers/Archive";
import { ArchiveView } from "../../actions/Archive";
import { Theme } from "@material-ui/core";
import { describeRoute } from "../../client-server-common/RouteUtilities";

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
        const lookup = describeRoute(pathname).archiveLookup;
        const kind = lookup?.kind || ArchiveKind.Articles;
        const archiveId = lookup?.archiveId;

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

export const capitalizeFirst = (string: string) => string.charAt(0).toUpperCase() + string.slice(1, string.length);

export const ShortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

