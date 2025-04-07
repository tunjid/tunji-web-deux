import { Namespace, Server as SocketServer } from 'socket.io';
import { Server as HttpsServer } from 'https';
import { fromEvent, merge, share, takeUntil, tap } from 'rxjs';
import { createAdapter } from '@socket.io/mongo-adapter';
import { ChangeStreamDocument, Collection } from 'mongodb';
import { SocketDeDupe } from '@tunji-web/server/src/models/SocketDedupeSchema';
import { changeListEvents } from '@tunji-web/server/src/config/changeLists';
import { ChangeList, ChangeListDocument } from '@tunji-web/server/src/models/ChangeListSchema';

interface ServerToClientEvents {
    modelChanged: (change: ChangeList) => void;
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

    changeListEvents
        .subscribe((changeEvent: ChangeStreamDocument<ChangeListDocument>) => {
            // Multiple server instances. Dedupe on the event ID and the first to write sends the event.
            const collectionChange = changeEvent.fullDocument;
            if (!collectionChange) return;

            const deDupe = new SocketDeDupe({key: collectionChange.dedupeId});
            deDupe
                .save()
                .then(() => {})
                .catch(error => {
                console.log('Received change event: ', changeEvent, 'notified: ', error == null);
                if (error) return;

                modelEventsNamespace
                    .to(MODEL_EVENTS_ROOM)
                    .emit('modelChanged', collectionChange);
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
