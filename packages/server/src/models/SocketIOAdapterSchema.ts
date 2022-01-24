import { model, Schema } from 'mongoose';

const SocketIOAdapterSchema = new Schema({}, {
    capped: {size: 1e6},
    bufferCommands: false,
    autoCreate: false // disable `autoCreate` since `bufferCommands` is false
});

export const SocketIOAdapter = model('SocketIOAdapter', SocketIOAdapterSchema);
