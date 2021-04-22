import { Document, Model, model, Schema } from 'mongoose'
import { Archive, ArchiveSchema } from "./Archive";

interface BlogPostDocument extends Document, Archive {
    link: string;
}

interface BlogPostModel extends Model<BlogPostDocument> {

}

const BlogPostSchema = new Schema({
    ...ArchiveSchema,
    comments: [{body: String, date: Date}],
});

const ExportedModel = model<BlogPostDocument, BlogPostModel>('BlogPost', BlogPostSchema);

export default ExportedModel
