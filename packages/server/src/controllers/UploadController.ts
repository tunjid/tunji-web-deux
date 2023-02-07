import multer from 'multer';

import { Request, RequestHandler } from 'express';
import { GoogleCloudStorageEngine } from '../config/GoogleCloudStorageEngine';
import { serverMessage } from '@tunji-web/server/src/controllers/Common';
import { Bucket, Storage } from '@google-cloud/storage';
import config from '@tunji-web/server/src/config/config';

interface ImageUploadParams {
    key: string,
    pathFunction: (req: Request) => string,
    permittedMimeTypes: Array<string> | undefined,
    handlers: Array<RequestHandler>
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
        permittedMimeTypes,
        handlers,
    }
) => {
    const result = [
        multer({
            fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
                const mimeType = file.mimetype;
                const filteredMimeTypes = permittedMimeTypes == undefined
                    ? []
                    : permittedMimeTypes.filter((testMimeType) => mimeType.indexOf(testMimeType) !== -1);
                const isLegalFile = permittedMimeTypes == undefined || filteredMimeTypes.length > 0;

                return isLegalFile
                    ? cb(null, true)
                    : cb(new Error('Invalid file type'));
            },
            storage: new GoogleCloudStorageEngine(pathFunction, bucket)
        }).single(key)
    ];

    return result.concat(handlers);
};

export const publicUrlToPath = (url: string) => url.substring(uploadRootDir.length, url.length);

export const pathToPublicUrl = (path: string) => `${uploadRootDir}${path}`;

export const publicUrlToApiUrl = (url: string) => `${config.apiEndpoint}/files/${publicUrlToPath(url)}`;

export const FileDeleter: RequestHandler = (req, res, next) => {
    const toDelete = req.fileOldUrl;
    if (!toDelete || !bucket) return serverMessage(res, {
        statusCode: 500,
        message: 'Unable to finish processing upload. The initial may have been successful',
    });

    if (!toDelete.startsWith(uploadRootDir)) return serverMessage(res, {
        statusCode: 400,
        message: 'Invalid file path',
    });
    const filePath = publicUrlToPath(toDelete);

    bucket?.file(filePath).delete((error) => {
        // Ignore error, just log it
        console.log(error);
        next();
    });
};

export const FileReader: RequestHandler = async (req, res, next) => {
    const publicUrl = req.filePublicUrl;
    if (!bucket) return serverMessage(res, {
        statusCode: 500,
        message: 'Unable to stream file',
    });

    if (!publicUrl.startsWith(uploadRootDir)) return serverMessage(res, {
        statusCode: 400,
        message: 'Invalid file path',
    });
    const filePath = publicUrlToPath(publicUrl);
    const file = bucket.file(filePath);
    const metadata = await file.getMetadata();

    // Add headers to describe file
    const headers = {
        'Content-Disposition': `attachment;filename=${metadata[0].name}`,
        'Content-Type': `${metadata[0].contentType}`
    };

    // Streams are supported for reading files.
    const remoteReadStream = file.createReadStream();

    // Set the response code & headers and pipe content to response
    res.status(200).set(headers);
    remoteReadStream.pipe(res);
};

export default ImageUploader;
