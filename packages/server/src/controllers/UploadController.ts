import multer from 'multer';

import { Request, RequestHandler } from 'express';
import { GoogleCloudStorageEngine } from '../config/GoogleCloudStorageEngine';
import { serverMessage } from '@tunji-web/server/src/controllers/Common';
import { Bucket, Storage } from '@google-cloud/storage';
import config from '@tunji-web/server/src/config/config';

interface ImageUploadParams {
    key: string,
    pathFunction: (req: Request) => string,
    deleteAfterUpload: boolean,
    postUpload: RequestHandler
    respond: RequestHandler
}

const bucket: Bucket | undefined = config.googleCloud
    ? new Storage({
        projectId: config.googleCloud.project_id,
        credentials: config.googleCloud,
    }).bucket(config.googleCloud.bucket)
    : undefined;

const uploadRootDir = `https://storage.googleapis.com/${bucket?.name}/`;

const ImageUploader: (
    params: ImageUploadParams
) => RequestHandler[] = (
    {
        key,
        pathFunction,
        deleteAfterUpload,
        postUpload,
        respond,
    }
) => {
    const result = [
        multer({
            fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
                const mimeType = file.mimetype;
                const isLegalFile = mimeType.indexOf('image/jpeg') !== -1
                    || mimeType.indexOf('image/png') !== -1;

                return isLegalFile
                    ? cb(null, true)
                    : cb(new Error('Invalid file type'));
            },
            storage: new GoogleCloudStorageEngine(pathFunction, bucket)
        }).single(key)
    ];

    result.push(postUpload);

    if (deleteAfterUpload) result.push(
        (req, res, next) => {
            const toDelete = req.fileOldUrl;
            if (!toDelete) return serverMessage(res, {
                statusCode: 500,
                message: 'Unable to finish processing upload. The initial may have been successful',
            });

            if(!toDelete.startsWith(uploadRootDir)) return next();
            const filePath = toDelete.substring(uploadRootDir.length, toDelete.length);

            bucket?.file(filePath).delete((error) => {
                // Ignore error, just log it
                console.log(error);
                next();
            });
        }
    );

    result.push(respond);

    return result;
};

export default ImageUploader;
