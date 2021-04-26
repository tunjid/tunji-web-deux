import { Response } from 'express';

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

export const errorMessage = (res: Response, message: string, statusCode: number) => {
    if (statusCode) res.status(statusCode);
    return basicMessage(res, message);
};

export const basicMessage = (res: Response, message: string) => {
    return res.json({message: message});
};
