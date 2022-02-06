import { Document, model, Schema } from 'mongoose';

const SocketDeDupeSchema = new Schema({
    key: {type: String, required: true, index: {unique: true}},
});

export const SocketDeDupe = model<Document>('SocketDeDupe', SocketDeDupeSchema);
