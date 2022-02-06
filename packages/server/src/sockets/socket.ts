import { Namespace, Server as SocketServer } from 'socket.io';
import { Server as HttpsServer } from 'https';
import { fromEvent, merge, share, takeUntil, tap } from 'rxjs';
import { createAdapter } from '@socket.io/mongo-adapter';
import { ChangeStreamDocument, Collection } from 'mongodb';
import { ArchiveDocument } from '@tunji-web/server/src/models/Archive';
import { Article } from '@tunji-web/server/src/models/ArticleSchema';
import { Project } from '@tunji-web/server/src/models/ProjectSchema';
import { Talk } from '@tunji-web/server/src/models/TalkSchema';
import { User } from '@tunji-web/server/src/models/UserSchema';
import { SocketDeDupe } from '@tunji-web/server/src/models/SocketDedupeSchema';
import { getErrorMessage } from '@tunji-web/server/src/controllers/Common';

interface ServerToClientEvents {
    modelChanged: (collection: string, id: string) => void;
    modelDeleted: (collection: string, id: string) => void;
}

interface ClientToServerEvents {
    join: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

const MODEL_EVENTS_NAMESPACE = '/model-events';
const MODEL_EVENTS_ROOM = 'model-events-room';

const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';
const MODEL_EVENTS_JOIN = 'join-model-events';
const MODEL_EVENTS_LEAVE = 'leave-model-events';
const ERROR = 'error';

const socketServer: (
    server: HttpsServer,
    adapterEventsCollection: Collection,
) => Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    = (server, adapterEventsCollection) => {
    const io = new SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);
    io.adapter(createAdapter(adapterEventsCollection));

    const modelEventsNamespace = io.of(MODEL_EVENTS_NAMESPACE);

    const modelChangeEvents = [Article, Project, Talk, User]
        .map(archiveModel => fromEvent<ChangeStreamDocument<ArchiveDocument>>(
            archiveModel.watch(),
            'change',
        ));

    merge(...modelChangeEvents)
        .subscribe(changeEvent => {
            const deDupe = new SocketDeDupe({key: changeEvent._id._data});
            deDupe.save(error => {
                console.log('Received change event: ', changeEvent, 'notified: ', error == null);
                if (error) return;
                const collection = changeEvent.ns.coll;
                // This is only valid bc the db is unsharded
                const id = changeEvent.documentKey?._id?.toString();

                if (!!collection && !!id) switch (changeEvent.operationType) {
                    case 'insert':
                    case 'update':
                        modelEventsNamespace
                            .to(MODEL_EVENTS_ROOM)
                            .emit('modelChanged', collection, id);
                        break;
                    case 'delete':
                        modelEventsNamespace
                            .to(MODEL_EVENTS_ROOM)
                            .emit('modelDeleted', collection, id);
                        break;
                    default:
                        break;
                }
            });
        });

    modelEventsNamespace.on(CONNECTION, (socket) => {
        const joins = fromEvent(socket, MODEL_EVENTS_JOIN)
            .pipe(tap(console.log));
        const leaves = fromEvent(socket, MODEL_EVENTS_LEAVE)
            .pipe(tap(console.log));
        const disconnections = fromEvent(socket, DISCONNECT)
            .pipe(tap(console.log));
        const errors = fromEvent(socket, ERROR)
            .pipe(tap(console.log));
        const terminations = merge(disconnections, errors)
            .pipe(share());

        joins
            .pipe(takeUntil(terminations))
            .subscribe(() => socket.join(MODEL_EVENTS_ROOM));
        leaves
            .pipe(takeUntil(terminations))
            .subscribe(() => socket.leave(MODEL_EVENTS_ROOM));
    });

    return modelEventsNamespace;
};

export default socketServer;
