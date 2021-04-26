import { AxiosResponse } from "axios";
import { AppDispatch } from "./index";
import { SnackbarActions, SnackbarKind } from "./Snackbar";

const emptyCallback = () => {
};

export const onHttpResponse = <T>(
    response: AxiosResponse<T>,
    onSuccess: (item: T) => void,
    onError: (response: AxiosResponse<T>) => void = emptyCallback) => {
    const status = response.status;
    if (status >= 200 && status < 400) onSuccess(response.data)
    else onError(response);
};

export const onSuccessOrSnackbar = <T>(
    response: AxiosResponse<T>,
    dispatch: AppDispatch,
    onSuccess: (item: T) => void) => {
    onHttpResponse(response, onSuccess, (response) => {
        const error = response.data as  any;
        const status = `status: ${response.status}`;
        const message = `${error.message || 'Unknown error'} ${status}`
        dispatch(SnackbarActions.enqueueSnackbar({
            title: message,
            kind: SnackbarKind.Error,
            key: Date().toString()
        }))
    })
};
