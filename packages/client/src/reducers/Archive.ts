import {
    ADD_ARCHIVE,
    ArchiveAction,
    EDIT_ARCHIVE,
    SET_ARCHIVE_DETAIL, UPDATE_ARCHIVE_FILES,
    UPDATE_ARCHIVE_SUMMARY,
    UPDATE_ARCHIVES,
    UPDATE_FETCH_STATUS
} from '../actions/Archive';
import _ from 'lodash';
import { ArchiveFile, ArchiveKind, ArchiveSummary, EmptyArchive, EmptyUser } from '@tunji-web/common';
import { PopulatedArchive } from '@tunji-web/client/src/models/PopulatedArchive';

export interface ArchiveState {
    archivesFetchStatus: Record<string, boolean>;
    kindToEditMap: Record<ArchiveKind, PopulatedArchive>;
    kindToDetailMap: Record<ArchiveKind, PopulatedArchive>;
    kindToArchivesMap: Record<ArchiveKind, PopulatedArchive[]>;
    summariesMap: Record<ArchiveKind, ArchiveSummary[]>;

    archiveIdToFilesMap: Record<string, ArchiveFile[]>;
}

function reduceKind<T>(item: T): Record<ArchiveKind, T> {
    return Object.values(ArchiveKind)
        .reduce((reduced, key) => {
            return {...reduced, [key]: Array.isArray(item) ? [...item] : {...item}};
        }, {} as Record<ArchiveKind, T>);
}

function transform<T>(record: Record<ArchiveKind, T>, mapper: (item: T) => T): Record<ArchiveKind, T> {
    return Object.entries(record)
        .reduce((reduced, [kind, value]) => {
            reduced[kind as ArchiveKind] = mapper(value);
            return reduced;
        }, {} as Record<ArchiveKind, T>);
}

const touchUp = (a: PopulatedArchive) => ({...a, created: new Date(a.created)});

const archiveReducer = (state = {
    archivesFetchStatus: {},
    kindToEditMap: reduceKind({...EmptyArchive, author: EmptyUser}),
    kindToDetailMap: reduceKind({...EmptyArchive, author: EmptyUser}),
    kindToArchivesMap: reduceKind([] as PopulatedArchive[]),
    summariesMap: reduceKind([] as PopulatedArchive[]),
    archiveIdToFilesMap: {},
}, action: ArchiveAction) => {
    switch (action.type) {
        case ADD_ARCHIVE: {
            const kind = action.payload.archive.kind;
            const view = action.payload.view;
            const archive = action.payload.archive;
            const isDetail = view === 'detail';
            const mapToEdit = isDetail ? state.kindToDetailMap : state.kindToEditMap;
            const editedMap = {...mapToEdit, [kind]: archive};
            return {
                ...state,
                kindToEditMap: isDetail ? state.kindToEditMap : editedMap,
                kindToDetailMap: isDetail ? editedMap : state.kindToDetailMap,
            };
        }
        case EDIT_ARCHIVE: {
            const edits = action.edits;
            const kind = edits.kind;
            if (!kind) return state;
            const existing = state.kindToEditMap[kind];
            const edited = {...existing, ...edits};
            const editedMap = {...state.kindToEditMap, [kind]: edited};
            return {
                ...state,
                kindToEditMap: editedMap,
            };
        }
        case UPDATE_ARCHIVES: {
            const kind = action.payload.kind;
            const existingArray = state.kindToArchivesMap[kind];
            const updatedArray = _.sortBy(
                _.unionBy(
                    action.payload.item,
                    existingArray,
                    (archive) => archive.key
                ),
                (archive) => -archive.created.getTime()
            );
            const updatedArchives = {...state.kindToArchivesMap, [kind]: updatedArray};

            return {
                ...state,
                kindToArchivesMap: updatedArchives,
            };
        }
        case SET_ARCHIVE_DETAIL: {
            return {
                ...state,
                kindToDetailMap: {
                    ...state.kindToDetailMap,
                    [action.payload.kind]: action.payload.item
                },
            };
        }
        case UPDATE_ARCHIVE_FILES: {
            const {item} = action.payload;
            const archiveIdToFilesMap = item.reduce<Record<string, ArchiveFile[]>>(
                (map, file) => {
                    const existingFiles = map[file.archiveId.toString()];
                    const files = existingFiles ? existingFiles : [];
                    const updatedFiles = [...files, file];
                    return {
                        ...map,
                        [file.archiveId.toString()]: _.uniqBy(updatedFiles, file => file.url)
                    };
                },
                state.archiveIdToFilesMap
            );
            return {...state, archiveIdToFilesMap};
        }
        case UPDATE_FETCH_STATUS: {
            const {queryKey, isLoading} = action.payload;
            const updatedStatus = {...state.archivesFetchStatus, [queryKey]: isLoading};
            return {...state, archivesFetchStatus: updatedStatus};
        }
        case UPDATE_ARCHIVE_SUMMARY: {
            const kind = action.payload.kind;
            const updatedSummaries = {
                ...state.summariesMap,
                [kind]: _.sortBy(
                    action.payload.item,
                    (summary) => -summary.dateInfo.year,
                    (summary) => -summary.dateInfo.month,
                )
            };
            return {
                ...state,
                summariesMap: updatedSummaries,
            };
        }
        default: {
            return state;
        }
    }
};


export const archiveStateSanitizer = (state: ArchiveState) => ({
    ...state,
    kindToEditMap: transform(state.kindToEditMap, touchUp),
    kindToDetailMap: transform(state.kindToDetailMap, touchUp),
    kindToArchivesMap: transform(state.kindToArchivesMap, (archives) => archives.map(touchUp)),
});

export default archiveReducer;
