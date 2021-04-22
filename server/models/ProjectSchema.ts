import { Document, Model, model, Schema } from 'mongoose'
import { Archive, ArchiveSchema } from "./Archive";

export interface ProjectDocument extends Document, Archive {
}

interface ProjectModel extends Model<ProjectDocument> {

}

const ProjectSchema = new Schema({
    ...ArchiveSchema,
});

export default model<ProjectDocument, ProjectModel>('Project', ProjectSchema);
