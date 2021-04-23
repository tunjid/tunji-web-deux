import { Document, Model, Schema } from 'mongoose';
import archiveModel, { Archive, ArchiveSchema } from './Archive';

export interface BlogPostDocument extends Document, Archive {
}

type BlogPostModel = Model<BlogPostDocument>

const BlogPostSchema = new Schema<BlogPostDocument, BlogPostModel>({
    ...ArchiveSchema,
});

export const BlogPost = archiveModel<BlogPostDocument, BlogPostModel>('BlogPost', BlogPostSchema);
