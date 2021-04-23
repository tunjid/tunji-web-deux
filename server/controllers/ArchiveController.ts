import { NextFunction, Request, Response } from 'express';
import { ArchiveModel } from '../models/Archive';

interface ArchiveController {
    create: (res: Request, req: Response, next: NextFunction) => void;
    get: (res: Request, req: Response, next: NextFunction) => void;
    put: (res: Request, req: Response, next: NextFunction) => void;
    remove: (res: Request, req: Response, next: NextFunction) => void;
    archiveById: (res: Request, req: Response, next: NextFunction, id: string) => void;
    find: (res: Request, req: Response, next: NextFunction) => void;
    archives: (res: Request, req: Response, next: NextFunction) => void;
    tagsOrCategories: (res: Request, req: Response, next: NextFunction) => void;
    hasAuthorization: (res: Request, req: Response, next: NextFunction) => void;
}

const getErrorMessage = function (error: any) {
    if (!error.errors) return 'Unkown server error';

    for (const errorName in error.errors)
        if (error.errors[errorName].message)
            return error.errors[errorName].message;
};

const composeMessage = (res: Response, message: string, statusCode: number) => {
    if (statusCode) res.status(statusCode);
    return res.json({message: message});
};

const archiveController = (Model: ArchiveModel): ArchiveController => ({
    create: (req, res) => {
        const archive = new Model(req.body);
        archive.author = req.user;

        if (!archive.author) return composeMessage(res, 'A blog post needs an author', 400);

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

        const query = {} as any;

        if (req.query.tag) query.tags = req.query.tag;

        if (req.query.category) query.categories = req.query.category;

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
            .populate('author', 'firstName lastName fullName')
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
        req.archive.remove((error: any) => {
            if (error) return next(error);
            else res.json(req.archive);
        });
    },
    archiveById: (req, res, next, id) => {
        Model.findById(id)
            .populate('author', 'firstName lastName fullName')
            .exec(function (error, archive) {
                if (error) return next(error);

                if (!archive) return composeMessage(res, 'Failed to load blog post with id ' + id, 400);

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
                    return composeMessage(res, 'Error retrieving tags / categories', 500);
                } else res.json(result);
            });
        } else return composeMessage(res, 'Must pick a tag or category', 400);
    },
    archives: (req, res) => {
        Model.aggregate(
            [{
                $group: {
                    _id: {month: {$month: '$created'}, year: {$year: '$created'}},
                    count: {$sum: 1},
                    titles: {$push: '$title'}
                }
            }],
            (error: any, result: any) => {
                if (error) {
                    return composeMessage(res, 'Error aggregating months', 500);
                } else res.json(result);
            }
        );
    },
    hasAuthorization: (res: Request, req: Response, next: NextFunction) => {
        if (req.archive.author.id !== req.user.id) {
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    }
});

export default archiveController;
