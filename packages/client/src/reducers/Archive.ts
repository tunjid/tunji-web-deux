import {
    ADD_ARCHIVE,
    ArchiveAction,
    EDIT_ARCHIVE,
    UPDATE_ARCHIVE_SUMMARY,
    UPDATE_ARCHIVES,
    UPDATE_FETCH_STATUS
} from '../actions/Archive';
import _ from 'lodash';
import { ArchiveKind, ArchiveLike, ArchiveSummary, EmptyArchive } from '@tunji-web/common';

export interface ArchiveState {
    archivesFetchStatus: Record<string, boolean>;
    kindToEditMap: Record<ArchiveKind, ArchiveLike>;
    kindToDetailMap: Record<ArchiveKind, ArchiveLike>;
    kindToArchivesMap: Record<ArchiveKind, ArchiveLike[]>;
    summariesMap: Record<ArchiveKind, ArchiveSummary[]>;
}

function reduceKind<T>(item: T): Record<ArchiveKind, T> {
    return Object.values(ArchiveKind)
        .reduce((reduced, key) => {
            return {...reduced, [key]: Array.isArray(item) ? [...item] : {...item}};
        }, {} as Record<ArchiveKind, T>);
}

const archiveReducer = (state = {
    archivesFetchStatus: {},
    kindToEditMap: reduceKind(EmptyArchive),
    kindToDetailMap: reduceKind(EmptyArchive),
    kindToArchivesMap: reduceKind([] as ArchiveLike[]),
    summariesMap: reduceKind([] as ArchiveSummary[]),
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
            }
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
            }
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
            )
            const updatedArchives = {...state.kindToArchivesMap, [kind]: updatedArray};

            return {
                ...state,
                kindToArchivesMap: updatedArchives,
            }
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
            }
        }
        default: {
            return state;
        }
    }
}


export default archiveReducer;
