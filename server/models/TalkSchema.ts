import { Document, Model, Schema } from 'mongoose';
import archiveModel, { Archive, ArchiveSchema } from './Archive';

export interface TalkDocument extends Document, Archive {
}

type TalkModel = Model<TalkDocument>

const TalkSchema = new Schema<TalkDocument, TalkModel>({
    ...ArchiveSchema,
});

export const Talk = archiveModel<TalkDocument, TalkModel>('Talk', TalkSchema);
