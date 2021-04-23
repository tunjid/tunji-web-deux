import { ArchiveKind } from "../reducers/Archive";
import { ArchiveLike } from "../../../common/Models";

export const ADD_ARCHIVES = 'ADD_ARCHIVES';

export interface ArchivePayload {
    kind: ArchiveKind,
    archives: ArchiveLike[]
}

export interface AddArchive {
    type: typeof ADD_ARCHIVES;
    payload: ArchivePayload;
}

export type ArchiveAction = AddArchive

export function addArchives(kind: ArchiveKind, archives: ArchiveLike[]): AddArchive {
    return {
        type: ADD_ARCHIVES,
        payload: {kind, archives}
    }
}
