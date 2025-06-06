import { ArchiveFile, ArchiveKind, ArchiveLike, describeRoute, UserLike } from '@tunji-web/common';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { StoreState } from '../../types';
import { ArchiveState } from '../../reducers/Archive';
import { ArchivesQuery, ArchiveView, yearAndMonthParam } from '../../actions/Archive';
import { MenuRes } from '../../types/MenuRes';


export interface ArchiveResourceProps {
    isSignedIn: boolean;
    kind: ArchiveKind;
    archiveId?: string;
    archive?: ArchiveLike;

    archiveFiles?: ArchiveFile[];
}

export const archiveSelector = (archiveViewType: ArchiveView, pathname: String) => createSelector<StoreState, ArchiveResourceProps, [UserLike | undefined, ArchiveState]>(
    [
        state => state.auth.signedInUser,
        state => state.archives,
    ],
    (signedInUser, archiveState) => {
        const lookup = describeRoute(pathname);
        const kind = lookup?.kind || ArchiveKind.Articles;
        const archiveId = lookup?.archiveId;

        return {
            isSignedIn: signedInUser !== undefined,
            kind,
            archiveId,
            archive: archiveViewType === 'detail' ? archiveState.kindToDetailMap[kind] : archiveState.kindToEditMap[kind],
            archiveFiles: archiveId ? archiveState.archiveIdToFilesMap[archiveId] : [],
        };
    }
);

export const archivesSelector = (querySelector: (StoreState: StoreState) => ArchivesQuery, max: number | undefined = undefined) => createSelector<StoreState, ArchivesQuery, ArchiveState, ArchiveLike[]>(
    querySelector,
    state => state.archives,
    (query, archiveState) => {
        const {kind, params} = query;
        const tags = params.getAll('tag').map((item => item.toLowerCase()));
        const categories = params.getAll('category').map((item => item.toLowerCase()));
        const yearAndMonth = yearAndMonthParam(query);

        let archives = archiveState.kindToArchivesMap[kind];
        archives = tags.length > 0 ? archives.filter(archive => _.intersection(tags, archive.tags).length > 0) : archives;
        archives = categories.length > 0 ? archives.filter(archive => _.intersection(categories, archive.categories).length > 0) : archives;
        archives = yearAndMonth
            ? archives.filter(archive => archive.created.getFullYear() === yearAndMonth.year && archive.created.getMonth() === yearAndMonth.month)
            : archives;
        archives = max ? archives.slice(0, max) : archives;

        return archives;
    }
);

export const MenuResEquality = (left: MenuRes | undefined, right: MenuRes | undefined) =>
    (left?.id === right?.id && left?.text === right?.text && left?.action?.type === right?.action?.type) || false;

export const readTime = (text: String) => {
    const readTimeMins = Math.ceil(text.trim().split(/\s+/).length / 250);
    return readTimeMins === 1
        ? `${readTimeMins} min`
        : `${readTimeMins} mins`;
};

export const archiveDate = (date: Date) => date.toDateString().split(' ').splice(1).join(' ');

export const capitalizeFirst = (string: string) => string.charAt(0).toUpperCase() + string.slice(1, string.length);

export const ShortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

