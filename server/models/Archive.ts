import { Document, Model, Schema } from 'mongoose';
import { UserDocument } from './UserSchema';

export interface Archive {
    _id: string,
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
    author: {type: Schema.Types.ObjectId, ref: 'User', required: 'Author is required',},
    tags: {type: [String], index: true, default: ['untagged']},
    categories: {type: [String], index: true, default: ['uncategorized']},
    created: {type: Date, default: Date.now}
};
