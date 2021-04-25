import { ADD_ARCHIVE, ADD_ARCHIVES, ArchiveAction, EDIT_ARCHIVE } from '../actions/Archive';
import _ from 'lodash';
import { ArchiveKind, ArchiveLike, EmptyArchive } from "../common/Models";

export interface ArchiveState {
    kindToEditMap: { [key in ArchiveKind]: ArchiveLike };
    kindToDetailMap: { [key in ArchiveKind]: ArchiveLike };
    kindToArchivesMap: { [key in ArchiveKind]: ArchiveLike[] };
}

const archiveReducer = (state = {
    kindToEditMap: {
        [ArchiveKind.Articles]: EmptyArchive,
        [ArchiveKind.Projects]: EmptyArchive,
        [ArchiveKind.Talks]: EmptyArchive,
    },
    kindToDetailMap: {
        [ArchiveKind.Articles]: EmptyArchive,
        [ArchiveKind.Projects]: EmptyArchive,
        [ArchiveKind.Talks]: EmptyArchive,
    },
    kindToArchivesMap: {
        [ArchiveKind.Articles]: [] as ArchiveLike[],
        [ArchiveKind.Projects]: [] as ArchiveLike[],
        [ArchiveKind.Talks]: [] as ArchiveLike[],
    },
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
