import {
    ArticleChange,
    CollectionChangeDocument,
    ProjectChange,
    TalkChange,
    UserChange
} from '@tunji-web/server/src/models/ModelChangesSchema';
import { ChangeStreamDocument } from 'mongodb';
import { fromEvent, merge, Observable } from 'rxjs';

const changeModels = [ArticleChange, ProjectChange, TalkChange, UserChange];

const recordModelChanges: () => void = () => {
    changeModels.forEach(changeModel => changeModel
        .getParentModel()
        .watch<Document>()
        .on('change', change => {
            const modelId = changeStreamDocumentId(change);
            const dedupeId = changeStreamDedupeId(change);
            if (!modelId || !dedupeId) return;

            const changeType = change.operationType === 'insert'
                ? 'create'
                : (change.operationType === 'update' || change.operationType === 'replace')
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


export default recordModelChanges;

export const modelChangeEvents: Observable<ChangeStreamDocument<CollectionChangeDocument>> = merge(...changeModels
    .map(archiveModel => fromEvent<ChangeStreamDocument<CollectionChangeDocument>>(
        archiveModel.watch<CollectionChangeDocument>(),
        'change',
    )));
