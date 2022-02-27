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
        const query = (after && typeof after === 'string') ? {_id: {$gte: new mongo.ObjectId(after)}} : {};

        changeListModel.aggregate([
                {'$match': query},
                {$sort: {_id: 1}},
                {
                    '$group': {
                        _id: {changeType: '$changeType', modelId: '$modelId'},
                        model: {$last: '$model'},
                        id: {$last: '$_id'}
                    }
                },
                {
                    '$project': {
                        _id: 0,
                        changeType: '$_id.changeType',
                        modelId: '$_id.modelId',
                        model: '$model',
                        id: '$id'
                    }
                },
                {$set: {_id: '$id'}},
                {$unset: 'id'},
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
