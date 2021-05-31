import { ArchiveKind, ArchiveLike, ArchiveSummary } from '@tunji-web/common';
import ApiService from "../rest/ApiService";
import { AppThunk } from "./index";
import { onSuccessOrSnackbar } from "./Common";
import { RouterActions } from "./Router";
import { SnackbarActions, SnackbarKind } from "./Snackbar";

export const ADD_ARCHIVE = 'ADD_ARCHIVE';
export const EDIT_ARCHIVE = 'EDIT_ARCHIVE';
export const UPDATE_ARCHIVES = 'UPDATE_ARCHIVES';
export const SAVE_ARCHIVE = 'SAVE_ARCHIVE';
export const UPDATE_ARCHIVE_SUMMARY = 'UPDATE_ARCHIVE_SUMMARY';
export const UPDATE_FETCH_STATUS = 'UPDATE_FETCH_STATUS';

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

export interface UpdateArchives {
    type: typeof UPDATE_ARCHIVES;
    payload: ArchivePayload<ArchiveLike[]>;
}

interface UpdateFetchStatusPayload {
    queryKey: string,
    isLoading: boolean
}

export interface UpdateFetchStatus {
    type: typeof UPDATE_FETCH_STATUS;
    payload: UpdateFetchStatusPayload;
}

export interface SaveArchive {
    type: typeof SAVE_ARCHIVE;
    archive: ArchiveLike;
}

export interface UpdateArchiveSummary {
    type: typeof UPDATE_ARCHIVE_SUMMARY;
    payload: ArchivePayload<ArchiveSummary[]>;
}

export type ArchiveAction = AddArchive | EditArchive | UpdateArchives | SaveArchive | UpdateArchiveSummary | UpdateFetchStatus;

export interface ArchivesQuery {
    key: string;
    kind: ArchiveKind;
    params: URLSearchParams
}

export const yearAndMonthParam = ({params}: ArchivesQuery) => {
    const dateInfo = params.get('dateInfo');
    const splitDate = dateInfo ? dateInfo.split('-') : [];
    const {year, month} = {year: parseInt(splitDate[0]), month: parseInt(splitDate[1])}

    return isNaN(year) && isNaN(month) ? undefined : {year, month}
}

interface IArchiveActions {
    fetchArchives: (query: ArchivesQuery) => AppThunk
    editArchive: (edits: Partial<ArchiveLike>) => EditArchive
    addArchive: (response: FetchArchiveResponse) => AddArchive
    addArchives: (payload: ArchivePayload<ArchiveLike[]>) => UpdateArchives
    updateArchiveFetchStatus: (payload: UpdateFetchStatusPayload) => UpdateFetchStatus
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
    fetchArchives: (query: ArchivesQuery) => async (dispatch) => {
        // dispatch(ArchiveActions.updateArchiveFetchStatus({queryKey: query.key, isLoading: true}));

        await onSuccessOrSnackbar(
            ApiService.fetchArchives(query),
            dispatch,
            (fetched) => {
                const archives = fetched.map((raw) => ({...raw, created: new Date(raw.created)}));
                dispatch(ArchiveActions.addArchives({kind: query.kind, item: archives}));
            },
            // () => dispatch(ArchiveActions.updateArchiveFetchStatus({queryKey: query.key, isLoading: false}))
        );
    },
    archiveSummaries: (kind: ArchiveKind) => async (dispatch) => {
        await onSuccessOrSnackbar(
            ApiService.archiveSummaries(kind),
            dispatch,
            (fetched) => dispatch(ArchiveActions.updateArchiveSummaries({
                kind, item: fetched.map(item => {
                    // Mongo aggregation pipeline does not 0 index months.
                    return {...item, dateInfo: {...item.dateInfo, month: item.dateInfo.month - 1}};
                })
            }))
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
        type: UPDATE_ARCHIVES,
        payload
    }),
    updateArchiveSummaries: (payload: ArchivePayload<ArchiveSummary[]>) => ({
        type: UPDATE_ARCHIVE_SUMMARY,
        payload
    }),
    updateArchiveFetchStatus: (payload: UpdateFetchStatusPayload) => ({
        type: UPDATE_FETCH_STATUS,
        payload
    }),
}
