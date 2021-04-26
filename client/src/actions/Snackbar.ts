export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export enum SnackbarKind {
    Success = 'success',
    Error = 'error',
}

export interface SnackbarNotification {
    key: string;
    title: string,
    kind: SnackbarKind,
    dismissed?: boolean,
}

interface EnqueueSnackbar {
    type: typeof ENQUEUE_SNACKBAR
    notification: SnackbarNotification
}

interface CloseSnackbar {
    type: typeof CLOSE_SNACKBAR,
    dismissAll: boolean,
    key: string
}

interface RemoveSnackbar {
    type: typeof REMOVE_SNACKBAR,
    key: string
}

export type SnackbarAction = EnqueueSnackbar | CloseSnackbar | RemoveSnackbar;

interface ISnackbarActions {
    enqueueSnackbar: (notification: SnackbarNotification) => EnqueueSnackbar;
    closeSnackbar: (key: string) => CloseSnackbar
    removeSnackbar: (key: string) => RemoveSnackbar
}

export const SnackbarActions: ISnackbarActions = {
    enqueueSnackbar: (notification: SnackbarNotification) => ({
        type: ENQUEUE_SNACKBAR,
        notification,
    }),
    closeSnackbar: (key: string) => ({
        type: CLOSE_SNACKBAR,
        dismissAll: !key, // dismiss all if no key has been defined
        key,
    }),
    removeSnackbar: (key: string) => ({
        type: REMOVE_SNACKBAR,
        key,
    }),
}


