import { Bucket } from '@google-cloud/storage';
import { Request } from 'express';
import { StorageEngine } from 'multer';

export class GoogleCloudStorageEngine implements StorageEngine {

    constructor(
        pathFunction: (req: Request) => string,
        bucket?: Bucket,
    ) {
        this.pathFunction = pathFunction;
        this.bucket = bucket;
    }

    readonly bucket?: Bucket;
    readonly pathFunction: (req: Request) => string;

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
        const path = this.pathFunction(req);
        return `${path}/${file.originalname}`;
    }
}
