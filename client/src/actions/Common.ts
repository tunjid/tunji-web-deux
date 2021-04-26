import { AxiosResponse } from "axios";

const emptyCallback = () => {
};

const onHttpResponse = <T>(
    response: AxiosResponse<T>,
    onSuccess: (item: T) => void,
    onError: (response: AxiosResponse<T>) => void = emptyCallback) => {
    const status = response.status;
    if (status >= 200 && status < 400) onSuccess(response.data)
    else onError(response);
};

export default onHttpResponse
