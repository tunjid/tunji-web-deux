import { Document, Model, Schema } from 'mongoose';
import { ArchiveFile } from '@tunji-web/common';

export interface ArchiveFileDocument extends Document, ArchiveFile {
}

export const ArchiveFileSchema: (archiveSchemaName: string) => Schema<ArchiveFileDocument, Model<ArchiveFileDocument>> = (archiveSchemaName: string) => new Schema<ArchiveFileDocument, Model<ArchiveFileDocument>>({
    url: {type: String, required: true, unique: true},
    mimetype: {type: String, required: true},
    archiveId: {type: Schema.Types.ObjectId, ref: archiveSchemaName, required: 'Model id is required',},
    uploader: {type: Schema.Types.ObjectId, ref: 'User', required: 'Uploader is required',},
    created: {type: Date, default: Date.now}
});
