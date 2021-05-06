import { Document, Model, Schema } from 'mongoose';
import archiveModel, { Archive, ArchiveSchema } from './Archive';

export interface ArticleDocument extends Document, Archive {
}

const ArticleSchema = new Schema<ArticleDocument, Model<ArticleDocument>>({
    ...ArchiveSchema,
});

export const Article = archiveModel<ArticleDocument>('Article', ArticleSchema);
