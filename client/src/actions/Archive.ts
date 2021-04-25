import { ArchiveKind, ArchiveLike } from "../common/Models";
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";

export const ADD_ARCHIVE = 'ADD_ARCHIVE';
export const EDIT_ARCHIVE = 'EDIT_ARCHIVE';
export const ADD_ARCHIVES = 'ADD_ARCHIVES';
export const SAVE_ARCHIVE = 'SAVE_ARCHIVE';

export type ArchiveView = 'detail' | 'edit';

export interface FetchArchiveRequest {
    id: string;
    view: ArchiveView;
    kind: ArchiveKind;
}

export interface FetchArchiveResponse {
    view: ArchiveView;
    archive: ArchiveLike;
}

export interface ArchivePayload {
    kind: ArchiveKind;
    archives: ArchiveLike[];
}

export interface AddArchive {
    type: typeof ADD_ARCHIVE;
    payload: FetchArchiveResponse;
}

export interface EditArchive {
    type: typeof EDIT_ARCHIVE;
    updatedArchive: ArchiveLike;
}

export interface AddArchives {
    type: typeof ADD_ARCHIVES;
    payload: ArchivePayload;
}

export interface SaveArchive {
    type: typeof SAVE_ARCHIVE;
    archive: ArchiveLike;
}

export type ArchiveAction = AddArchive | EditArchive | AddArchives | SaveArchive;

interface IArchiveActions {
    fetchArchive: (request: FetchArchiveRequest) => AppThunk
    fetchArchives: (kind: ArchiveKind) => AppThunk
    editArchive: (updatedArchive: ArchiveLike) => EditArchive
    addArchive: (response: FetchArchiveResponse) => AddArchive
    addArchives: (kind: ArchiveKind, archives: ArchiveLike[]) => AddArchives
    saveArchive: (archive?: ArchiveLike) => AppThunk
}

export const ArchiveActions: IArchiveActions = {
    fetchArchive: (request: FetchArchiveRequest) => async (dispatch) => {
        const response = await ApiService.fetchArchive(request.kind, request.id);
        const status = response.status;
        if (status < 200 || status > 399) return;

        const archive = {...response.data, created: new Date(response.data.created)};
        dispatch(ArchiveActions.addArchive({archive, view: request.view}));
    },
    fetchArchives: (kind: ArchiveKind) => async (dispatch) => {
        const response = await ApiService.fetchArchives(kind);
        const status = response.status;
        if (status < 200 || status > 399) return;

        const archives = response.data.map((raw) => ({...raw, created: new Date(raw.created)}));
        dispatch(ArchiveActions.addArchives(kind, archives));
    },
    saveArchive: (archive?: ArchiveLike) => async () => {
        if (archive) await ApiService.saveArchive(archive);
    },
    addArchive: (response: FetchArchiveResponse) => ({
        type: ADD_ARCHIVE,
        payload: response
    }),
    editArchive: (updatedArchive: ArchiveLike) => ({
        type: EDIT_ARCHIVE,
        updatedArchive
    }),
    addArchives: (kind: ArchiveKind, archives: ArchiveLike[]) => ({
        type: ADD_ARCHIVES,
        payload: {kind, archives}
    }),
}
