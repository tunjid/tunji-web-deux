import { Document, Model, model, Schema } from 'mongoose'
import { Archive, ArchiveSchema } from "./Archive";

export interface BlogPostDocument extends Document, Archive {
}

interface BlogPostModel extends Model<BlogPostDocument> {

}

const BlogPostSchema = new Schema({
    ...ArchiveSchema,
});

export default model<BlogPostDocument, BlogPostModel>('BlogPost', BlogPostSchema);
