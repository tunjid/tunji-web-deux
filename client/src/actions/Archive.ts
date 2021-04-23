import { Archive } from "../../../server/models/Archive";
import { ArchiveKind } from "../reducers/Archive";

export const ADD_ARCHIVES = 'ADD_ARCHIVES';

export interface ArchivePayload {
    kind: ArchiveKind,
    archives: Archive[]
}

export interface AddArchive {
    type: typeof ADD_ARCHIVES;
    payload: ArchivePayload;
}

export type ArchiveAction = AddArchive
