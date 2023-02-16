import { Document, model, Model, Schema } from 'mongoose';
import { UserDocument } from './UserSchema';
import { ArchiveKind, ArchiveLike, slugify } from '@tunji-web/common';
import { ArchiveFileDocument, ArchiveFileSchema } from '@tunji-web/server/src/models/ArchiveFileSchema';

export interface Archive extends ArchiveLike {
    title: string;
    body: string;
    description: string;
    author: UserDocument['_id'];
    thumbnail?: string;
    videoUrl?: string;
    created: Date;
    likes: number;
    spanCount?: number;
    tags: string[];
    categories: string[];
}

export type ArchiveDocument = Document & Archive

export interface ArchiveModel<T extends ArchiveDocument = ArchiveDocument> extends Model<T> {
    getKind: () => ArchiveKind
    fileModel: () => Model<ArchiveFileDocument>
}

const TagOrCategory = {
    type: [String],
    index: true,
    set: (items: string[]) => items.map(item => item.toLowerCase().trim()),
};

export const ArchiveSchema = {
    title: {type: String, required: true},
    body: {type: String, required: true},
    description: {type: String, required: true},
    thumbnail: {type: String},
    videoUrl: {type: String},
    likes: {type: Number, default: 0},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: 'Author is required',},
    tags: {...TagOrCategory, default: ['untagged']},
    categories: {...TagOrCategory, default: ['uncategorized']},
    created: {type: Date, default: Date.now}
};

export default function archiveModel<D extends ArchiveDocument>(name: string, schema: Schema<D, ArchiveModel<D>>): ArchiveModel<D> {
    const kind = `${name.toLowerCase()}s` as ArchiveKind;
    const archiveFileSchema = ArchiveFileSchema(name);

    schema.statics.getKind = function () {
        return kind;
    };

    schema.statics.fileModel = function () {
        return model<ArchiveFileDocument>(`${name}File`, archiveFileSchema);
    };

    schema.virtual('key')
        .get(function (this: D) {
            return this._id;
        });

    schema.virtual('kind')
        .get(function (this: D) {
            return kind;
        });

    schema.virtual('link')
        .get(function (this: D) {
            return `${slugify(this.title)}-${this._id}`.toLowerCase();
        });

    schema.set('toJSON', {
        virtuals: true,
        transform: (doc: ArchiveDocument, ret: Partial<ArchiveDocument>) => {
            if (!ret.thumbnail) ret.thumbnail = 'https://miro.medium.com/max/4800/1*F7eVQ1Fe7-O6vZWvEt7kHg.png';
            return ret;
        }
    });

    return model<D, ArchiveModel<D>>(name, schema);
}
