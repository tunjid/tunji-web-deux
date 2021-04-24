import { ArchiveKind } from "../reducers/Archive";
import { ArchiveLike } from "../../../common/Models";
import { ThunkAction } from "redux-thunk";
import { StoreState } from "../types";
import ApiService from "../rest/ApiService";

export const ADD_ARCHIVES = 'ADD_ARCHIVES';

export interface ArchivePayload {
    kind: ArchiveKind,
    archives: ArchiveLike[]
}

export interface AddArchive {
    type: typeof ADD_ARCHIVES;
    payload: ArchivePayload;
}

export type ArchiveAction = AddArchive

interface IArchiveActions {
    fetchArchives: (kind: ArchiveKind) => ThunkAction<void, StoreState, unknown, AddArchive>
    addArchives: (kind: ArchiveKind, archives: ArchiveLike[]) => AddArchive
}

export const ArchiveActions: IArchiveActions = {
    fetchArchives: (kind: ArchiveKind) => async (dispatch) => {
        const response = await ApiService.fetchArchives(kind);
        const status = response.status;
        if (status < 200 || status > 399) return;

        const archives = response.data.map((raw) => ({...raw, created: new Date(raw.created)}));
        dispatch(ArchiveActions.addArchives(kind, archives));
    },
    addArchives: (kind: ArchiveKind, archives: ArchiveLike[]) => ({
        type: ADD_ARCHIVES,
        payload: {kind, archives}
    })
}
