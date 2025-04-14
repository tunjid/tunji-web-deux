import { ChangeListModels, ChangeListDocument } from '@tunji-web/server/src/models/ChangeListSchema';
import { Types } from 'mongoose';
import { fromEvent, merge, Observable } from 'rxjs';
import { ChangeStreamDocument } from 'mongodb';

const recordChangeLists: () => Promise<void> = async () => {
    ChangeListModels.forEach(changeModel => changeModel
        .getParentModel()
        .watch<Document>()
        .on('change', async change => {
            // This is only valid bc the db is unsharded
            const modelId = change.documentKey?._id?.toString();
            if (!modelId) return;

            const dedupeId = change._id._data;
            const existing = await changeModel.findOne({dedupeId}).exec();

            if (existing) return;
            const operationType = change.operationType;

            const changeType = (operationType === 'update' || operationType === 'replace' || operationType === 'insert')
                ? 'update'
                : operationType === 'delete'
                    ? 'delete'
                    : null;

            if (!changeType) return;

            changeModel.replaceOne(
                {
                    modelId
                },
                {
                    modelId,
                    dedupeId,
                    changeType,
                    changeId: new Types.ObjectId(),
                    model: changeModel.getParentModel().collection.collectionName,
                },
                {
                    upsert: true,
                },
            )
                .then(() => {
                })
                .catch((error) => {
                    if (error) console.log(error);
                });
        }));
};

export default recordChangeLists;

export const changeListEvents: Observable<ChangeStreamDocument<ChangeListDocument>> =
    merge(
        ...ChangeListModels
            .map(archiveModel => fromEvent<ChangeStreamDocument<ChangeListDocument>>(
                archiveModel.watch<ChangeListDocument>(),
                'change',
            ))
    );
