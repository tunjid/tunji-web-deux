import { Document, Model, model, Schema, Types } from 'mongoose';
import { Talk } from '@tunji-web/server/src/models/TalkSchema';
import { Article } from '@tunji-web/server/src/models/ArticleSchema';
import { Project } from '@tunji-web/server/src/models/ProjectSchema';
import { User } from '@tunji-web/server/src/models/UserSchema';

type ChangeType = 'create' | 'update' | 'delete'

export interface ChangeList {
    changeType: ChangeType;
    modelId: Types.ObjectId;
    model: string;
    dedupeId: string
}

export interface ChangeListDocument extends Document, ChangeList {
}

export interface ChangeListModel extends Model<ChangeList> {
    getParentModel: () => Model<Document>
}

const changeListSchema = (model: Model<any>) => new Schema<ChangeListDocument, ChangeListModel>({
    modelId: {type: Schema.Types.ObjectId, required: true, ref: model.collection.collectionName},
    model: {type: String, required: true},
    changeType: {type: String, required: true, enum: ['create', 'update', 'delete']},
    dedupeId: {type: String, required: true, index: {unique: true}},
});

function changeListModel(
    parentModel: Model<any>,
    name: string,
): ChangeListModel {

    const schema = changeListSchema(parentModel);

    schema.statics.getParentModel = function () {
        return parentModel;
    };

    schema.set('toJSON', {
        virtuals: true,
    });

    return model<ChangeListDocument, ChangeListModel>(name, schema);
}


export const ChangeListModels = [
    changeListModel(
        Article,
        'ArticleChange',
    ),
    changeListModel(
        Project,
        'ProjectChange',
    ),
    changeListModel(
        Talk,
        'TalkChange',
    ),
    changeListModel(
        User,
        'UserChange',
    ),
];

