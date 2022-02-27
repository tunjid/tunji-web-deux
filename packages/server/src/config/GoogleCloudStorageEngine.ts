import { Bucket, Storage } from '@google-cloud/storage';
import { Request } from 'express';
import { StorageEngine } from 'multer';
import config from './config';

export class GoogleCloudStorageEngine implements StorageEngine {

    constructor(
        pathFunction: (req: Request) => string,
        oldUrlFunction: (req: Request) => string,
    ) {
        this.pathFunction = pathFunction;
        this.oldUrlFunction = oldUrlFunction;
    }

    readonly pathFunction: (req: Request) => string;
    readonly oldUrlFunction: (req: Request) => string;

    private readonly bucket?: Bucket | null = config.googleCloud
        ? new Storage({
            projectId: config.googleCloud.project_id,
            credentials: config.googleCloud,
        }).bucket(config.googleCloud.bucket)
        : null;

    _handleFile(req: Request, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File>) => void): void {
        if (!this.bucket) return callback(Error('No google cloud storage config'));

        const destination = this.uploadPath(req, file);
        const cloudFile = this.bucket.file(destination);
        const outStream = cloudFile.createWriteStream({
            resumable: false,
            metadata: {contentType: file.mimetype}
        });

        file.stream.pipe(outStream)
            .on('error', callback)
            .on('finish', () => {
                req.filePublicUrl = cloudFile.publicUrl();
                return callback(null, {});
            });
    }

    _removeFile(req: Request, file: Express.Multer.File, callback: (error: (Error | null)) => void): void {
        if (!this.bucket) return callback(Error('No google cloud storage config'));

        const destination = this.uploadPath(req, file);
        this.bucket.file(destination).delete(callback);
    }

    uploadPath(req: Request, file: Express.Multer.File): string {
        const ext = file.mimetype.indexOf('png') === -1 ? '.jpg' : '.png';
        const path = this.pathFunction(req);
        return `${path}${ext}`;
    }
}
