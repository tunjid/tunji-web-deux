import { ADD_ARCHIVES, addArchives, ArchiveAction } from '../actions/Archive';
import _ from 'lodash';
import { ArchiveLike } from "../../../common/Models";
import axios from 'axios'
import { ThunkAction } from "redux-thunk";
import { StoreState } from "../types";

export enum ArchiveKind {
    Articles = 'articles',
    Projects = 'projects',
    Talks = 'talks',
}

export interface ArchiveState {
    kind: ArchiveKind,
    archives: ArchiveLike[];
}

export const fetchArchives = (
    kind: ArchiveKind
): ThunkAction<void, StoreState, unknown, ArchiveAction> => async (dispatch) => {
    const response = await axios.get<ArchiveLike[]>(`/api/${kind}`);
    const archives = response.data.map((raw) => ({...raw, created: new Date(raw.created)}));
    dispatch(addArchives(kind, archives));
};

const archiveReducerFor = (kind: ArchiveKind) => {
    return (state = {
        kind,
        archives: [] as ArchiveLike[],
    }, action: ArchiveAction) => {
        switch (action.type) {
            case ADD_ARCHIVES: {
                return {
                    ...state,
                    archives: _.sortBy(
                        _.unionBy(
                            action.payload.archives,
                            state.archives,
                            (archive) => archive.key
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
