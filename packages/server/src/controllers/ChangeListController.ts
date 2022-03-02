import { NextFunction, Request, Response } from 'express';
import { serverMessage } from './Common';
import { ChangeListModels } from '@tunji-web/server/src/models/ChangeListSchema';
import { mongo } from 'mongoose';

interface ChangeListController {
    changes: (req: Request, res: Response, next: NextFunction) => void;
    modelMatch: (req: Request, res: Response, next: NextFunction, model: string) => void;
}

const changeListController = (): ChangeListController => ({
    changes: async (req, res, next) => {
        const changeListModel = req.changeListModel;

        const after = req.query['after'];
        const query = (after && typeof after === 'string')
            ? {changeId: {$gt: new mongo.ObjectId(after)}}
            : {};

        changeListModel.find(
            query,
            null,
            {sort: {changeId: 1}},
            (error, changeList) => {
                if (error) return next(error);
                res.json(changeList);
            });
    },

    modelMatch: (req, res, next, modelName) => {
        const changeListModel = ChangeListModels.find(model => model.getParentModel().collection.name == modelName);
        if (!changeListModel) return serverMessage(res, {
            statusCode: 400,
            message: `${modelName} is not a valid model`,
        });

        req.changeListModel = changeListModel;
        next();
    },
});

export default changeListController;
