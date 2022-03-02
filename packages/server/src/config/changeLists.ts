import { ChangeListModels, ChangeListDocument } from '@tunji-web/server/src/models/ChangeListSchema';
import { Types } from 'mongoose';
import { fromEvent, merge, Observable } from 'rxjs';
import { ChangeStreamDocument } from 'mongodb';

const recordChangeLists: () => void = () => {
    ChangeListModels.forEach(changeModel => changeModel
        .getParentModel()
        .watch<Document>()
        .on('change', change => {
            const modelId = changeStreamDocumentId(change);
            if (!modelId) return;

            const changeType = (change.operationType === 'update' || change.operationType === 'replace' || change.operationType === 'insert')
                ? 'update'
                : change.operationType === 'delete'
                    ? 'delete'
                    : null;

            if (!changeType) return;
            changeModel.updateOne(
                {
                    modelId
                },
                {
                    modelId,
                    changeType,
                    changeId: new Types.ObjectId(),
                    model: changeModel.getParentModel().collection.collectionName,
                },
                {
                    upsert: true,
                },
                (error) => {
                    if (error) console.log(error);
                }
            );
        }));
};

// This is only valid bc the db is unsharded
const changeStreamDocumentId:
    (changeStream: ChangeStreamDocument<Document>) => string =
    (document) => document.documentKey?._id?.toString();


export default recordChangeLists;

export const changeListEvents: Observable<ChangeStreamDocument<ChangeListDocument>> =
    merge(...ChangeListModels
        .map(archiveModel => fromEvent<ChangeStreamDocument<ChangeListDocument>>(
            archiveModel.watch<ChangeListDocument>(),
            'change',
        )));
