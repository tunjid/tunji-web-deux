import { ADD_ARCHIVE, ADD_ARCHIVES, ArchiveAction, EDIT_ARCHIVE } from '../actions/Archive';
import _ from 'lodash';
import { ArchiveKind, ArchiveLike, ArchiveSummary, EmptyArchive } from "../common/Models";

export interface ArchiveSearchOptions {
    from?: Date
    to?: Date
}

export interface ArchiveState {
    kindToEditMap: Record<ArchiveKind,  ArchiveLike>;
    kindToDetailMap: Record<ArchiveKind,  ArchiveLike>;
    kindToArchivesMap: Record<ArchiveKind,  ArchiveLike[]>;
    searchOptionsMap: Record<ArchiveKind, ArchiveSearchOptions>;
    summariesMap: Record<ArchiveKind, ArchiveSummary[]>;
}

export const DefaultSearchOptions: ArchiveSearchOptions = {}

function reduceKind<T>(item: T): Record<ArchiveKind,  T> {
    return Object.values(ArchiveKind)
        .reduce((reduced, key) => {
        return {...reduced, [key]: Array.isArray(item) ? [...item] : {...item}};
    }, {} as Record<ArchiveKind,  T>);
}

const archiveReducer = (state = {
    kindToEditMap: reduceKind(EmptyArchive),
    kindToDetailMap: reduceKind(EmptyArchive),
    kindToArchivesMap: reduceKind([] as ArchiveLike[]),
    searchOptionsMap: reduceKind(DefaultSearchOptions),
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
        case ADD_ARCHIVES: {
            const kind = action.payload.kind;
            const existingArray = state.kindToArchivesMap[kind];
            const updatedArray = _.sortBy(
                _.unionBy(
                    action.payload.archives,
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
    }
    return state;
}


export default archiveReducer;
