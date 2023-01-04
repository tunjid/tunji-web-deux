import { NextFunction, Request, Response } from 'express';
import { ArchiveDocument, ArchiveModel } from '../models/Archive';
import { ErrorCode, getErrorMessage, serverMessage } from './Common';
import { mongo } from 'mongoose';

interface ArchiveFileController {
    create: (req: Request, res: Response, next: NextFunction) => void;
    find: (req: Request, res: Response, next: NextFunction) => void;
    sendArchiveFile: (req: Request, res: Response, next: NextFunction) => void;
    remove: (req: Request, res: Response, next: NextFunction) => void;
    removeByUrl: (req: Request, res: Response, next: NextFunction) => void;
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
        new FileModel({
            url: newUrl,
            mimetype: req.file.mimetype,
            archiveId: req.archive.id,
            uploader: req.user
        }).save(error => {
            if (error) return res.status(400).send({
                message: getErrorMessage(error)
            });
            else next();
        });
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
            .exec(function (error, archives) {
                if (error) {
                    return res.status(400).send({
                        message: getErrorMessage(error)
                    });
                } else {
                    res.json(archives);
                }
            });
    },
    sendArchiveFile: async (req, res) => {
        if (req.archiveFile) res.json(req.archiveFile);
        else serverMessage(res, {
            statusCode: 500,
            message: 'Archive file not found',
        });
    },
    remove: (req, res, next) => {
        const FileModel = Model.fileModel();
        FileModel.findByIdAndRemove(req.archiveFile.id, {}, (error, file) => {
            req.fileOldUrl = file?.url;
            if (error) return next(error);
            else next();
        });
    },
    removeByUrl: (req, res, next) => {
        const FileModel = Model.fileModel();
        if (req.filePublicUrl !== req.fileOldUrl) FileModel.findOneAndRemove({url: req.fileOldUrl}, {}, () => {
            next();
        });
        else next();
    },
    byId: (req, res, next, id) => {
        const FileModel = Model.fileModel();
        const lookup = FileModel.findById(id);

        lookup.exec(function (error, archiveFile) {
            if (error) return next(error);

            if (!archiveFile) return serverMessage(res, {
                errorCode: ErrorCode.ModelNotFound,
                statusCode: 400,
                model: Model.getKind(),
                message: 'Failed to find archive media with id ' + id,
            });

            req.archiveFile = archiveFile;
            next();
        });
    },
});

export default archiveFileController;
