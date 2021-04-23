import { Document, Model, Schema } from 'mongoose';
import archiveModel, { Archive, ArchiveSchema } from './Archive';

export interface ProjectDocument extends Document, Archive {
}

type ProjectModel = Model<ProjectDocument>

const ProjectSchema = new Schema<ProjectDocument, ProjectModel>({
    ...ArchiveSchema,
});

export const Project = archiveModel<ProjectDocument, ProjectModel>('Project', ProjectSchema);
