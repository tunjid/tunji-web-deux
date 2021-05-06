import axios, { AxiosError, AxiosResponse } from "axios";
import { AppDispatch } from "./index";
import { SnackbarActions, SnackbarKind } from "./Snackbar";

const emptyCallback = () => {
};

interface ApiError {
    message: string
}

export const onHttpResponse = async <T>(
    request: Promise<AxiosResponse<T>>,
    onSuccess: (item: T) => void,
    onError: (response: AxiosError<ApiError>) => void = emptyCallback
) => {
    try {
        const response = await request;
        onSuccess(response.data)
    } catch (err: any) {
        if (axios.isAxiosError(err)) onError(err)
        else console.log('Unknown error')
    }
};

export const onSuccessOrSnackbar = async <T>(
    request: Promise<AxiosResponse<T>>,
    dispatch: AppDispatch,
    onSuccess: (item: T) => void,
    onError: (response: AxiosError<ApiError>) => void = emptyCallback
) => {
    await onHttpResponse(request, onSuccess, (error) => {
        const response = error.response;
        const status = `status: ${response?.status}`;
        const message = `${response?.data?.message || 'Unknown error'} ${status}`
        onError(error);
        dispatch(SnackbarActions.enqueueSnackbar({
            title: message,
            kind: SnackbarKind.Error,
            key: Date().toString()
        }))
    })
};
