import { ArchiveKind, ArchiveLike } from "../common/Models";
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";
import onHttpResponse from "./Common";
import { RouterActions } from "./Router";

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
    edits: Partial<ArchiveLike>;
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
    fetchArchives: (kind: ArchiveKind) => AppThunk
    editArchive: (edits: Partial<ArchiveLike>) => EditArchive
    addArchive: (response: FetchArchiveResponse) => AddArchive
    addArchives: (kind: ArchiveKind, archives: ArchiveLike[]) => AddArchives
    createArchive: (kind: ArchiveKind) => AppThunk
    readArchive: (request: FetchArchiveRequest) => AppThunk
    updateArchive: (kind: ArchiveKind) => AppThunk
    deleteArchive: (kind: ArchiveKind) => AppThunk
}

export const ArchiveActions: IArchiveActions = {
    createArchive: (kind: ArchiveKind) => async (dispatch, getState) => {
        const state = getState();
        const edited = {...state.archives.kindToEditMap[kind]};
        onHttpResponse(await ApiService.createArchive(edited), (created) => {
            dispatch(RouterActions.replace(`/${created.kind}/${created.key}/edit`))
        });
    },
    readArchive: (request: FetchArchiveRequest) => async (dispatch) => {
        onHttpResponse(await ApiService.readArchive(request.kind, request.id), (fetched) => {
            const archive = {...fetched, created: new Date(fetched.created)};
            dispatch(ArchiveActions.addArchive({archive, view: request.view}));
        });
    },
    updateArchive: (kind: ArchiveKind) => async (dispatch, getState) => {
        const state = getState();
        const edited = state.archives.kindToEditMap[kind];
        await ApiService.updateArchive(edited);
    },
    deleteArchive: (kind: ArchiveKind) => async (dispatch, getState) => {
        const state = getState();
        const edited = state.archives.kindToEditMap[kind];
        onHttpResponse(await ApiService.updateArchive(edited), () => {
            dispatch(RouterActions.pop());
        });
    },
    fetchArchives: (kind: ArchiveKind) => async (dispatch) => {
        onHttpResponse(await ApiService.fetchArchives(kind), (fetched) => {
            const archives = fetched.map((raw) => ({...raw, created: new Date(raw.created)}));
            dispatch(ArchiveActions.addArchives(kind, archives));
        });
    },
    addArchive: (response: FetchArchiveResponse) => ({
        type: ADD_ARCHIVE,
        payload: response
    }),
    editArchive: (edits: Partial<ArchiveLike>) => ({
        type: EDIT_ARCHIVE,
        edits
    }),
    addArchives: (kind: ArchiveKind, archives: ArchiveLike[]) => ({
        type: ADD_ARCHIVES,
        payload: {kind, archives}
    }),
}
