import { NextFunction, Request, Response } from 'express';
import { ArchiveDocument, ArchiveModel } from '../models/Archive';
import { ErrorCode, getErrorMessage, serverMessage } from './Common';
import { mongo } from 'mongoose';
import { pathToPublicUrl } from '@tunji-web/server/src/controllers/UploadController';

interface ArchiveFileController {
    create: (req: Request, res: Response, next: NextFunction) => void;
    find: (req: Request, res: Response, next: NextFunction) => void;
    sendArchiveFile: (req: Request, res: Response, next: NextFunction) => void;
    remove: (req: Request, res: Response, next: NextFunction) => void;
    removeByUrl: (req: Request, res: Response, next: NextFunction) => void;

    fileByPath: (req: Request, res: Response, next: NextFunction) => void;

    byId: (req: Request, res: Response, next: NextFunction, id: string) => void;
}

const archiveFileController = <T extends ArchiveDocument>(Model: ArchiveModel<T>): ArchiveFileController => ({
    create: async (req, res, next) => {
        const newUrl = req.filePublicUrl;
        if (!req.file || !newUrl) return serverMessage(res, {
            statusCode: 500,
            model: Model.getKind(),
            message: 'unable to upload file',
        });

        const FileModel = Model.fileModel();
        try {
            await new FileModel({
                url: newUrl,
                mimetype: req.file.mimetype,
                archiveId: req.archive.id,
                uploader: req.user
            }).save();
            next();
        } catch (error) {
            return res.status(400).send({
                message: getErrorMessage(error)
            });
        }
    },
    find: (req, res) => {
        const FileModel = Model.fileModel();
        const limit = Number(req.query.limit) || 0;
        const offset = Number(req.query.offset) || 0;

        const {id} = req.query;
        const query = id
            ? {
                _id: {
                    $in: (
                        Array.isArray(id)
                            ? id
                            : [id]
                    ).map(it => new mongo.ObjectId(it.toString()))
                }
            }
            : {};


        FileModel.find(query)
            .skip(offset)
            .limit(limit)
            .sort({'created': -1})
            .then(archives => {
                res.json(archives);
            })
            .catch(error => {
                return res.status(400).send({
                    message: getErrorMessage(error)
                });
            });
    },
    sendArchiveFile: async (req, res) => {
        if (req.archiveFile) res.json(req.archiveFile);
        else serverMessage(res, {
            statusCode: 500,
            message: 'Archive file not found',
        });
    },
    remove: async (req, res, next) => {
        const FileModel = Model.fileModel();
        try {
            const file = await FileModel.findByIdAndRemove(req.archiveFile.id);
            req.fileOldUrl = file?.url;
            next();
        } catch (error) {
            return next(error);
        }
    },
    removeByUrl: async (req, res, next) => {
        const FileModel = Model.fileModel();
        if (req.filePublicUrl !== req.fileOldUrl) {
            try {
                await FileModel.findOneAndRemove({url: req.fileOldUrl});
                next();
            } catch (error) {
                next(error);
            }
        } else {
            next();
        }
    },
    fileByPath: (req, res, next) => {
        const split = req.path.split('files/');
        req.filePublicUrl = pathToPublicUrl(split[split.length - 1]);
        next();
    },
    byId: (req, res, next, id) => {
        const FileModel = Model.fileModel();
        const lookup = FileModel.findById(id);

        lookup
            .then(archiveFile => {
                if (!archiveFile) return serverMessage(res, {
                    errorCode: ErrorCode.ModelNotFound,
                    statusCode: 400,
                    model: Model.getKind(),
                    message: 'Failed to find archive media with id ' + id,
                });

                req.archiveFile = archiveFile;
                next();
            })
            .catch(error => {
                return next(error);
            });
    },
});

export default archiveFileController;