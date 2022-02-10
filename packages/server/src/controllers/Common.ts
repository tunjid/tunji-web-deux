import { Response } from 'express';


export enum ErrorCode {
    NotLoggedIn = 'not-logged-in',
    ModelNotFound = 'model-not-found',
    RateLimited = 'rate-limited',
}

export const getErrorMessage = function (error: any): string {
    // Define the error message variable
    let message: string | undefined;

    // If an internal MongoDB error occurs get the error message
    if (error.code) switch (error.code) {
        // If a unique index error occurs set the message error
        case 11000:
        case 11001:
            message = 'Username already exists';
            break;
    }

    if (!message && error.errors) for (const errorName in error.errors) {
        if (error.errors[errorName].message) {
            message = error.errors[errorName].message;
            break;
        }
    }
    return message || 'Unknown server error';
};

export const serverMessage = (res: Response, params: {
    message: string,
    statusCode: number,
    errorCode?: ErrorCode,
    model?: string
}) => {
    if (params.statusCode) res.status(params.statusCode);
    return res.json({
        errorCode: params.errorCode,
        message: params.message,
        model: params.model,
    });
};
