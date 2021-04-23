import { Document, Model, Schema } from 'mongoose';
import { UserDocument } from './UserSchema';

export interface Archive {
    title: string;
    body: string;
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
    body: String,
    author: {type: Schema.Types.ObjectId, ref: 'User', required: 'Author is required',},
    tags: {type: [String], index: true, default: ['untagged']},
    categories: {type: [String], index: true, default: ['uncategorized']},
    created: {type: Date, default: Date.now}
};
