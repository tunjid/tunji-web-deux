import { Document, Model, Schema } from 'mongoose';
import archiveModel, { Archive, ArchiveSchema } from './Archive';

export interface TalkDocument extends Document, Archive {
}

const TalkSchema = new Schema<TalkDocument, Model<TalkDocument>>({
    ...ArchiveSchema,
});

export const Talk = archiveModel<TalkDocument>('Talk', TalkSchema);
