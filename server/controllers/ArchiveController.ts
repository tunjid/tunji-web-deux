import { NextFunction, Request, Response } from 'express';
import { ArchiveDocument, ArchiveModel } from '../models/Archive';
import { errorMessage, getErrorMessage } from './Common';
import { ArchiveSummary } from '../../client/src/client-server-common/Models';

interface ArchiveController {
    create: (res: Request, req: Response, next: NextFunction) => void;
    get: (res: Request, req: Response, next: NextFunction) => void;
    put: (res: Request, req: Response, next: NextFunction) => void;
    remove: (res: Request, req: Response, next: NextFunction) => void;
    byId: (res: Request, req: Response, next: NextFunction, id: string) => void;
    find: (res: Request, req: Response, next: NextFunction) => void;
    summary: (res: Request, req: Response, next: NextFunction) => void;
    tagsOrCategories: (res: Request, req: Response, next: NextFunction) => void;
    hasAuthorization: (res: Request, req: Response, next: NextFunction) => void;
}

const archiveController = <T extends ArchiveDocument>(Model: ArchiveModel<T>): ArchiveController => ({
    create: (req, res) => {
        const archive = new Model(req.body);
        archive.author = req.user?.id;

        if (!archive.author) return errorMessage(res, 'A blog post needs an author', 400);

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

        const {tag, category} = req.query;
        const query = {} as any;

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
    get: (req, res) => {
        res.json(req.archive);
    },
    put: (req, res, next) => {
        Model.findByIdAndUpdate(req.archive.id, req.body, (error, archive) => {
            if (error) return next(error);
            else res.json(archive);
        });
    },
    remove: (req, res, next) => {
        Model.findByIdAndRemove(req.archive.id, {}, (error: any) => {
            if (error) return next(error);
            else res.json(req.archive);
        });
    },
    byId: (req, res, next, id) => {
        Model.findById(id)
            .populate('author', 'firstName lastName fullName imageUrl')
            .exec(function (error, archive) {
                if (error) return next(error);

                if (!archive) return errorMessage(res, 'Failed to load blog post with id ' + id, 400);

                req.archive = archive;
                next();
            });
    },
    tagsOrCategories: (req, res) => {
        const type = req.query.type;

        if (type == 'tags' || type == 'categories') {
            const excludedFields = {} as any;
            excludedFields[type] = {$ne: null};
            Model.distinct(type, excludedFields, function (error, result) {
                if (error) {
                    return errorMessage(res, 'Error retrieving tags / categories', 500);
                } else res.json(result);
            });
        } else return errorMessage(res, 'Must pick a tag or category', 400);
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
                if (error) return errorMessage(res, 'Error aggregating months', 500);
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
