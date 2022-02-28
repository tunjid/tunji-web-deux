import { ChangeListModels, ChangeListDocument } from '@tunji-web/server/src/models/ChangeListSchema';
import { ChangeStreamDocument } from 'mongodb';
import { fromEvent, merge, Observable } from 'rxjs';

const recordChangeLists: () => void = () => {
    ChangeListModels.forEach(changeModel => changeModel
        .getParentModel()
        .watch<Document>()
        .on('change', change => {
            const modelId = changeStreamDocumentId(change);
            const dedupeId = changeStreamDedupeId(change);
            if (!modelId || !dedupeId) return;

            const changeType = (change.operationType === 'update' || change.operationType === 'replace' || change.operationType === 'insert')
                ? 'update'
                : change.operationType === 'delete'
                    ? 'delete'
                    : null;

            if (!changeType) return;
            new changeModel({
                    changeType,
                    modelId,
                    dedupeId,
                    model: changeModel.getParentModel().collection.collectionName,
                }
            ).save((error) => {
                console.log(error);
            });
        }));
};

const changeStreamDedupeId:
    (changeStream: ChangeStreamDocument<Document>) => string =
    (document) => document._id?._data;

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
