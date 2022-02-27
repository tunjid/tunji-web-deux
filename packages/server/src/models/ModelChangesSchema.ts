import { Document, Model, model, Schema, Types } from 'mongoose';
import { Talk } from '@tunji-web/server/src/models/TalkSchema';
import { Article } from '@tunji-web/server/src/models/ArticleSchema';
import { Project } from '@tunji-web/server/src/models/ProjectSchema';
import { User } from '@tunji-web/server/src/models/UserSchema';

type ChangeType = 'create' | 'update' | 'delete'

export interface CollectionChange {
    changeType: ChangeType;
    modelId: Types.ObjectId;
    model: string;
    dedupeId: string
}

export interface CollectionChangeDocument extends Document, CollectionChange {
}

export interface CollectionChangeModel extends Model<CollectionChange> {
    getParentModel: () => Model<Document>
}

export const collectionChangeSchema = (model: Model<any>) => new Schema<CollectionChangeDocument, CollectionChangeModel>({
    modelId: {type: Schema.Types.ObjectId, required: true, ref: model.collection.collectionName},
    model: {type: String, required: true},
    changeType: {type: String, required: true, enum: ['create', 'update', 'delete']},
    dedupeId: {type: String, required: true, index: {unique: true}},
});

function changeModel(
    parentModel: Model<any>,
    name: string,
): CollectionChangeModel {

    const schema = collectionChangeSchema(parentModel);

    schema.statics.getParentModel = function () {
        return parentModel;
    };

    schema.set('toJSON', {
        virtuals: true,
    });

    return model<CollectionChangeDocument, CollectionChangeModel>(name, schema);
}


export const ArticleChange = changeModel(
    Article,
    'ArticleChange',
);

export const ProjectChange = changeModel(
    Project,
    'ProjectChange',
);

export const TalkChange = changeModel(
    Talk,
    'TalkChange',
);

export const UserChange = changeModel(
    User,
    'UserChange',
);
