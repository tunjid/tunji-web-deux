import { ADD_ARCHIVES, ArchiveAction } from '../actions/Archive';
import _ from 'lodash';
import { ArchiveKind, ArchiveLike } from "../common/Models";

export interface ArchiveState {
    kind: ArchiveKind,
    archives: ArchiveLike[];
}

const archiveReducerFor = (kind: ArchiveKind) => {
    return (state = {
        kind,
        archives: [] as ArchiveLike[],
    }, action: ArchiveAction) => {
        switch (action.type) {
            case ADD_ARCHIVES: {
                return action.payload.kind !== kind ? state : {
                    ...state,
                    archives: _.sortBy(
                        _.unionBy(
                            action.payload.archives,
                            state.archives,
                            (archive) => archive.key
                        ),
                        (archive) => -archive.created.getTime()
                    ),
                }
            }
        }
        return state;
    }
}

export default archiveReducerFor;
