import { Document, Model, model, Schema } from "mongoose";
import { Archive, ArchiveSchema } from "./Archive";

export interface ProjectDocument extends Document, Archive {
}

type ProjectModel = Model<ProjectDocument>

const ProjectSchema = new Schema<ProjectDocument, ProjectModel>({
    ...ArchiveSchema,
});

export const Project = model<ProjectDocument, ProjectModel>("Project", ProjectSchema);
