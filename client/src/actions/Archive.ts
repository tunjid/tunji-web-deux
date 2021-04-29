import { ArchiveKind, ArchiveLike, ArchiveSummary } from "../common/Models";
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";
import { onSuccessOrSnackbar } from "./Common";
import { RouterActions } from "./Router";
import { SnackbarActions, SnackbarKind } from "./Snackbar";

export const ADD_ARCHIVE = 'ADD_ARCHIVE';
export const EDIT_ARCHIVE = 'EDIT_ARCHIVE';
export const ADD_ARCHIVES = 'ADD_ARCHIVES';
export const SAVE_ARCHIVE = 'SAVE_ARCHIVE';
export const UPDATE_ARCHIVE_SUMMARY = 'UPDATE_ARCHIVE_SUMMARY';

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

export interface ArchivePayload<T> {
    kind: ArchiveKind;
    item: T;
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
    payload: ArchivePayload<ArchiveLike[]>;
}

export interface SaveArchive {
    type: typeof SAVE_ARCHIVE;
    archive: ArchiveLike;
}

export interface UpdateArchiveSummary {
    type: typeof UPDATE_ARCHIVE_SUMMARY;
    payload: ArchivePayload<ArchiveSummary[]>;
}

export type ArchiveAction = AddArchive | EditArchive | AddArchives | SaveArchive | UpdateArchiveSummary;

interface IArchiveActions {
    fetchArchives: (kind: ArchiveKind) => AppThunk
    editArchive: (edits: Partial<ArchiveLike>) => EditArchive
    addArchive: (response: FetchArchiveResponse) => AddArchive
    addArchives: (payload: ArchivePayload<ArchiveLike[]>) => AddArchives
    updateArchiveSummaries: (payload: ArchivePayload<ArchiveSummary[]>) => UpdateArchiveSummary
    createArchive: (kind: ArchiveKind) => AppThunk
    readArchive: (request: FetchArchiveRequest) => AppThunk
    updateArchive: (kind: ArchiveKind) => AppThunk
    deleteArchive: (kind: ArchiveKind) => AppThunk
    archiveSummaries: (kind: ArchiveKind) => AppThunk
}

export const ArchiveActions: IArchiveActions = {
    createArchive: (kind: ArchiveKind) => async (dispatch, getState) => {
        const state = getState();
        const edited = {...state.archives.kindToEditMap[kind]};
        await onSuccessOrSnackbar(
            ApiService.createArchive(edited),
            dispatch,
            (created) => {
                dispatch(RouterActions.replace(`/${created.kind}/${created.key}/edit`))
            }
        );
    },
    readArchive: (request: FetchArchiveRequest) => async (dispatch) => {
        await onSuccessOrSnackbar(
            ApiService.readArchive(request.kind, request.id),
            dispatch,
            (fetched) => {
                const archive = {...fetched, created: new Date(fetched.created)};
                dispatch(ArchiveActions.addArchive({archive, view: request.view}));
            }
        );
    },
    updateArchive: (kind: ArchiveKind) => async (dispatch, getState) => {
        const state = getState();
        const edited = state.archives.kindToEditMap[kind];
        await onSuccessOrSnackbar(
            ApiService.updateArchive(edited),
            dispatch,
            (archive) => dispatch(SnackbarActions.enqueueSnackbar({
                    key: archive.key,
                    kind: SnackbarKind.Success,
                    title: 'Updated!'
                })
            )
        );
    },
    deleteArchive: (kind: ArchiveKind) => async (dispatch, getState) => {
        const state = getState();
        const edited = state.archives.kindToEditMap[kind];
        await onSuccessOrSnackbar(
            ApiService.deleteArchive(edited),
            dispatch,
            () => dispatch(RouterActions.pop())
        );
    },
    fetchArchives: (kind: ArchiveKind) => async (dispatch) => {
        await onSuccessOrSnackbar(
            ApiService.fetchArchives(kind),
            dispatch,
            (fetched) => {
                const archives = fetched.map((raw) => ({...raw, created: new Date(raw.created)}));
                dispatch(ArchiveActions.addArchives({kind, item: archives}));
            }
        );
    },
    archiveSummaries: (kind: ArchiveKind) => async (dispatch) => {
        await onSuccessOrSnackbar(
            ApiService.archiveSummaries(kind),
            dispatch,
            (fetched) => dispatch(ArchiveActions.updateArchiveSummaries({kind, item: fetched.map(item => {
                    // Mongo aggregation pipeline does not 0 index months.
                    return {...item, dateInfo: {...item.dateInfo, month: item.dateInfo.month - 1}};
                })}))
        );
    },
    addArchive: (response: FetchArchiveResponse) => ({
        type: ADD_ARCHIVE,
        payload: response
    }),
    editArchive: (edits: Partial<ArchiveLike>) => ({
        type: EDIT_ARCHIVE,
        edits
    }),
    addArchives: (payload: ArchivePayload<ArchiveLike[]>) => ({
        type: ADD_ARCHIVES,
        payload
    }),
    updateArchiveSummaries: (payload: ArchivePayload<ArchiveSummary[]>) => ({
        type: UPDATE_ARCHIVE_SUMMARY,
        payload
    }),
}
