import { Document, Model, Schema } from 'mongoose';
import archiveModel, { Archive, ArchiveSchema } from './Archive';

export interface ProjectDocument extends Document, Archive {
}

const ProjectSchema = new Schema<ProjectDocument, Model<ProjectDocument>>({
    ...ArchiveSchema,
});

export const Project = archiveModel<ProjectDocument>('Project', ProjectSchema);
