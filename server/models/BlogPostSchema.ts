import { Document, Model, model, Schema } from 'mongoose'
import { Archive, ArchiveSchema } from "./Archive";

export interface BlogPostDocument extends Document, Archive {
}

interface BlogPostModel extends Model<BlogPostDocument> {

}

const BlogPostSchema = new Schema<BlogPostDocument, BlogPostModel>({
    ...ArchiveSchema,
});

export const BlogPost = model<BlogPostDocument, BlogPostModel>('BlogPost', BlogPostSchema);
