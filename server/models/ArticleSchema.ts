import { Document, Model, Schema } from 'mongoose';
import archiveModel, { Archive, ArchiveSchema } from './Archive';

export interface ArticleDocument extends Document, Archive {
}

type ArticleModel = Model<ArticleDocument>

const ArticleSchema = new Schema<ArticleDocument, ArticleModel>({
    ...ArchiveSchema,
});

export const Article = archiveModel<ArticleDocument, ArticleModel>('Article', ArticleSchema);
