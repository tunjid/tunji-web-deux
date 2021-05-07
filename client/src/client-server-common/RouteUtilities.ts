import { ArchiveKind } from "./Models";

export interface RouteDescription {
    root: string
    kind?: ArchiveKind
    archiveId?: string
}

const isObjectIdLike = (plausibleId: string) => !!plausibleId.match(/^[0-9a-fA-F]{24}$/)

export const OpenGraphScrapeEndpoint = 'open-graph-scrape';

export const normalizeArchiveKind = (text: String) => Object.values(ArchiveKind).find(item => item === text) || ArchiveKind.Articles

export const describeRoute = (path: string): RouteDescription => {
    const pathSegments = path.split('/').filter(segment => segment !== 'edit');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const linkSplit = lastSegment.split('-');
    const kind = normalizeArchiveKind(pathSegments[1]);
    const archiveId = linkSplit[linkSplit.length - 1];

    const root = pathSegments[1];
    const isArchivePath = isObjectIdLike(archiveId);

    return {
        root,
        kind,
        archiveId: isArchivePath ? archiveId : undefined
    };
};
