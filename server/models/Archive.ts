import { Document, model, Model, Schema } from 'mongoose';
import { UserDocument } from './UserSchema';
import { ArchiveLike } from '../../client/src/common/Models';

export interface Archive extends ArchiveLike {
    title: string;
    body: string;
    description: string;
    author: UserDocument['_id'];
    thumbnail?: string;
    created: Date;
    spanCount?: number;
    tags: string[];
    categories: string[];
}

export type ArchiveDocument = Document & Archive

export type ArchiveModel = Model<ArchiveDocument>

export const ArchiveSchema = {
    title: {type: String, required: true},
    body: {type: String, required: true},
    description: {type: String, required: true},
    thumbnail: {type: String},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: 'Author is required',},
    tags: {type: [String], index: true, default: ['untagged']},
    categories: {type: [String], index: true, default: ['uncategorized']},
    created: {type: Date, default: Date.now}
};

export default function archiveModel<D extends Document, M extends Model<D>>(name: string, schema: Schema<D, M>): M {
    schema.virtual('key')
        .get(function (this: D) {
            return this._id;
        });

    schema.virtual('kind')
        .get(function (this: D) {
            return `${name.toLowerCase()}s`;
        });

    schema.set('toJSON', {
        virtuals: true
    });

    return model<D, M>(name, schema);
}
