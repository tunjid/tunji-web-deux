import { Document, Model, model, Schema } from 'mongoose'
import { Archive, ArchiveSchema } from "./Archive";

export interface TalkDocument extends Document, Archive {
}

interface TalkModel extends Model<TalkDocument> {

}

const TalkSchema = new Schema<TalkDocument, TalkModel>({
    ...ArchiveSchema,
});

export const Talk = model<TalkDocument, TalkModel>('Talk', TalkSchema);
