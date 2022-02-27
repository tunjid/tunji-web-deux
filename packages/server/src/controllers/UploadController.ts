import multer from 'multer';

import { Request, RequestHandler } from 'express';
import { GoogleCloudStorageEngine } from '../config/GoogleCloudStorageEngine';

const ImageUploader: (
    key: string,
    pathFunction: (req: Request) => string,
    oldUrlFunction: (req: Request) => string,
) => RequestHandler = (
    key,
    pathFunction,
    oldUrlFunction,
) => multer({
    fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const mimeType = file.mimetype;
        const isLegalFile = mimeType.indexOf('image/jpeg') !== -1
            || mimeType.indexOf('image/png') !== -1;

        return isLegalFile
            ? cb(null, true)
            : cb(new Error('Invalid file type'));
    },
    storage:  new GoogleCloudStorageEngine(pathFunction, oldUrlFunction)
}).single(key);

export default ImageUploader;
