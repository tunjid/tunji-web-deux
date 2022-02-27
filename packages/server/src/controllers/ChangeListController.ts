import { NextFunction, Request, Response } from 'express';
import { ErrorCode, getErrorMessage, serverMessage } from './Common';
import { ChangeListModels } from '@tunji-web/server/src/models/ChangeListSchema';

interface ChangeListController {
    changes: (req: Request, res: Response, next: NextFunction) => void;
    modelMatch: (req: Request, res: Response, next: NextFunction, model: string) => void;
}

const changeListController = (): ChangeListController => ({
    changes: async (req, res, next) => {
        const changeListModel = req.changeListModel;

        const query = req.query['after'] ? {_id: {$gte: req.query.after}} : {};

        changeListModel.aggregate([
                {'$match': query},
                {'$group': {_id: {changeType: '$changeType', modelId: '$modelId'}}},
                {'$project': {_id: 0, changeType: '$_id.changeType', modelId: '$_id.modelId'}}
            ],
            undefined,
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
