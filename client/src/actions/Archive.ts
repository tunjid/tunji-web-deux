import { ArchiveKind, ArchiveLike } from "../common/Models";
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";

export const ADD_ARCHIVES = 'ADD_ARCHIVES';
export const SAVE_ARCHIVE = 'SAVE_ARCHIVE';

export interface ArchivePayload {
    kind: ArchiveKind,
    archives: ArchiveLike[]
}

export interface AddArchives {
    type: typeof ADD_ARCHIVES;
    payload: ArchivePayload;
}

export interface SaveArchive {
    type: typeof SAVE_ARCHIVE;
    archive: ArchiveLike;
}

export type ArchiveAction = AddArchives | SaveArchive;

interface IArchiveActions {
    fetchArchives: (kind: ArchiveKind) => AppThunk
    addArchives: (kind: ArchiveKind, archives: ArchiveLike[]) => AddArchives
    saveArchive: (archive?: ArchiveLike) => AppThunk
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
    }),
    saveArchive: (archive?: ArchiveLike) => async () => {
        if (archive) await ApiService.saveArchive(archive);
    },
}
