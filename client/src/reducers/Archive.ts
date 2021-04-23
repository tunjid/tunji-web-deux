import { Archive } from "../../../server/models/Archive";

export enum ArchiveKind {
    Article = 'article',
    Project = 'project',
    Talk = 'talk',
}

export interface ArchiveState {
    kind: ArchiveKind,
    cards: Archive[];
}

const archiveReducerFor = (kind: ArchiveKind) => {
    return (state = {
        kind,
        cards: [] as Archive[],
    }, action: any) => {
        return state;
    }
}

export default archiveReducerFor;
