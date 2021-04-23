import { Archive } from '../../../server/models/Archive';
import { ADD_ARCHIVES, ArchiveAction } from '../actions/Archive';
import _ from 'lodash';

export enum ArchiveKind {
    Article = 'article',
    Project = 'project',
    Talk = 'talk',
}

export interface ArchiveState {
    kind: ArchiveKind,
    archives: Archive[];
}

const archiveReducerFor = (kind: ArchiveKind) => {
    return (state = {
        kind,
        cards: [] as Archive[],
    }, action: ArchiveAction) => {
        switch (action.type) {
            case ADD_ARCHIVES: {
                return {
                    ...state,
                    archives: _.sortBy(
                        _.unionBy(
                            action.payload.archives,
                            state.cards,
                            (archive) => archive._id
                        ),
                        (archive) => archive.created
                    ),
                }
            }
        }
        return state;
    }
}

export default archiveReducerFor;
