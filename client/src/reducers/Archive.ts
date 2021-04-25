import { ADD_ARCHIVES, ArchiveAction } from '../actions/Archive';
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
                archives: updatedArchives,
            }
        }
    }
    return state;
}


export default archiveReducer;
