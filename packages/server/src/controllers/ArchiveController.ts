import { NextFunction, Request, Response } from 'express';
import { ArchiveDocument, ArchiveModel } from '../models/Archive';
import { ErrorCode, getErrorMessage, serverMessage } from './Common';
import { ArchiveSummary } from '@tunji-web/common';
import { CallbackError, HydratedDocument, mongo } from 'mongoose';

interface ArchiveController {
    create: (req: Request, res: Response, next: NextFunction) => void;
    put: (req: Request, res: Response, next: NextFunction) => void;
    uploadImage: (req: Request, res: Response, next: NextFunction) => void;
    remove: (req: Request, res: Response, next: NextFunction) => void;
    byId: (req: Request, res: Response, next: NextFunction, id: string) => void;
    sendArchive: (req: Request, res: Response, next: NextFunction) => void;
    find: (req: Request, res: Response, next: NextFunction) => void;
    incrementLikes: (req: Request, res: Response, next: NextFunction) => void;
    summary: (req: Request, res: Response, next: NextFunction) => void;
    tagsOrCategories: (req: Request, res: Response, next: NextFunction) => void;
    hasAuthorization: (req: Request, res: Response, next: NextFunction) => void;
}

const archiveController = <T extends ArchiveDocument>(Model: ArchiveModel<T>): ArchiveController => ({
    create: (req, res) => {
        const archive = new Model(req.body);
        archive.author = req.user?.id;

        if (!archive.author) return serverMessage(res, {
            statusCode: 400,
            message: 'A blog post needs an author',
        });

        archive.save(error => {
            if (error) return res.status(400).send({
                message: getErrorMessage(error)
            });
            else res.json(archive);
        });
    },
    find: (req, res) => {
        const limit = Number(req.query.limit) || 0;
        const offset = Number(req.query.offset) || 0;

        const {id, tag, category} = req.query;
        const query = {} as any;

        if (id) query._id = {$in: (Array.isArray(id) ? id : [id]).map(it => new mongo.ObjectId(it.toString()))};

        if (tag) query.tags = Array.isArray(tag)
            ? {$in: tag.map((item: any) => item.toString().toLowerCase())}
            : tag.toString().toLowerCase();

        if (category) query.categories = Array.isArray(category)
            ? {$in: category.map((item: any) => item.toString().toLowerCase())}
            : category.toString().toLowerCase();

        if (req.query.freeForm) {
            const searchString = req.query.freeForm;

            query.$or = [
                {'title': {'$regex': searchString, '$options': 'i'}},
                {'tags': {'$regex': searchString, '$options': 'i'}},
                {'categories': {'$regex': searchString, '$options': 'i'}}
            ];
        }

        if (req.query.month && req.query.year) {
            const month = Number(req.query.month) || 0;
            const year = Number(req.query.year) || 0;

            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month, 31);

            query.created = {
                $gte: startDate,
                $lt: endDate
            };
        }

        Model.find(query)
            .skip(offset)
            .limit(limit)
            .sort({'created': -1})
            .populate('author', 'firstName lastName fullName imageUrl')
            .exec(function (error, archives) {
                if (error) {
                    console.log(error);
                    return res.status(400).send({
                        message: getErrorMessage(error)
                    });
                } else {
                    res.json(archives);
                }
            });
    },
    sendArchive: async (req, res) => {
        if (req.archive) res.json(req.archive);
        else serverMessage(res, {
            statusCode: 500,
            message: 'Archive not found',
        });
    },
    put: (req, res, next) => {
        Model.findByIdAndUpdate(req.archive.id, req.body, (error: CallbackError, archive: HydratedDocument<T> | null) => {
            if (error) return next(error);
            else next();
        });
    },
    uploadImage: async (req, res, next) => {
        const newUrl = req.filePublicUrl;
        req.fileOldUrl = req.archive.thumbnail;
        if (!req.file || !newUrl) return serverMessage(res, {
            statusCode: 500,
            model: Model.getKind(),
            message: 'unable to upload file',
        });
        Model.findByIdAndUpdate(req.archive.id, {thumbnail: newUrl}, (error: CallbackError, archive: HydratedDocument<T> | null) => {
            if (error) return next(error);
            else next();
        });
    },
    remove: (req, res, next) => {
        Model.findByIdAndRemove(req.archive.id, {}, (error: any) => {
            if (error) return next(error);
            else next();
        });
    },
    byId: (req, res, next, id) => {
        Model.findById(id)
            .populate('author', 'firstName lastName fullName imageUrl')
            .exec(function (error, archive) {
                if (error) return next(error);

                if (!archive) return serverMessage(res, {
                    errorCode: ErrorCode.ModelNotFound,
                    statusCode: 400,
                    model: Model.getKind(),
                    message: 'Failed to find archive with id ' + id,
                });

                req.archive = archive;
                next();
            });
    },
    incrementLikes: async (req, res, next) => {
        Model.findById(req.archive.id, (error: CallbackError, archive: HydratedDocument<T> | null) => {
            if (error) return next(error);
            if (!archive) return serverMessage(res, {
                errorCode: ErrorCode.ModelNotFound,
                statusCode: 400,
                model: Model.getKind.toString(),
                message: 'Failed to find model',
            });

            const likeIncrement = parseInt(req.body.increment);
            if (!likeIncrement) return serverMessage(res, {
                statusCode: 400,
                message: 'Like increment not specified',
            });

            archive.likes = archive.likes + likeIncrement;
            archive.save((saveError, saved) => {
                if (saveError) return next(saveError);
                req.archive = saved;
                next();
            });
        });
    },
    tagsOrCategories: (req, res) => {
        const type = req.query.type;

        if (type == 'tags' || type == 'categories') {
            const excludedFields = {} as any;
            excludedFields[type] = {$ne: null};
            Model.distinct(type, excludedFields, function (error, result) {
                if (error) {
                    return serverMessage(res, {
                        statusCode: 500,
                        message: 'Error retrieving tags / categories',
                    });
                } else res.json(result);
            });
        } else return serverMessage(res, {
            statusCode: 400,
            message: 'Must pick a tag or category',
        });
    },
    summary: (req, res) => {
        Model.aggregate(
            [{
                $group: {
                    _id: {month: {$month: '$created'}, year: {$year: '$created'}},
                    count: {$sum: 1},
                    titles: {$push: '$title'}
                }
            }],
            (error: any, result: any[]) => {
                if (error) return serverMessage(res, {
                    statusCode: 500,
                    message: 'Error aggregating months',
                });
                res.json(result.map<ArchiveSummary>(({_id, ...data}) => ({...data, dateInfo: _id})));
            }
        );
    },
    hasAuthorization: (req: Request, res: Response, next: NextFunction) => {
        if (req.archive.author.id.toString() !== req.user?.id?.toString()) {
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    }
});

export default archiveController;
