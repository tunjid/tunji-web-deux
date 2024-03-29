import { Schema } from 'mongoose';

export interface UserLike {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    imageUrl: string;
}

export interface ArchiveLike {
    key: string,
    link: string;
    title: string;
    body: string;
    description: string;
    thumbnail?: string;
    videoUrl?: string;
    author: string,
    created: Date;
    likes: number;
    spanCount?: number;
    tags: string[];
    categories: string[];
    kind: ArchiveKind,
}

export interface DateInfo {
    month: number;
    year: number;
}

export interface ArchiveSummary {
    titles: string[];
    dateInfo: DateInfo;
}

export type Author = UserLike;

export enum ArchiveKind {
    Articles = 'articles',
    Projects = 'projects',
    Talks = 'talks',
}

export interface ArchiveFile {
    url: string;
    mimetype: string;
    kind: ArchiveKind;
    archiveId: Schema.Types.ObjectId;
    uploader: Schema.Types.ObjectId;
    created: Date;
}

export const EmptyUser: UserLike = {
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    imageUrl: '',
};

export const EmptyArchive: ArchiveLike = {
    key: '',
    link: '',
    title: '',
    body: '',
    likes: 0,
    description: '',
    author: '',
    created: new Date(),
    tags: [],
    categories: [],
    kind: ArchiveKind.Articles,
};

export interface RouteDescription {
    root: string
    kind?: ArchiveKind
    archiveId?: string
}

const isObjectIdLike = (plausibleId: string) => !!plausibleId.match(/^[0-9a-fA-F]{24}$/);

export const OpenGraphScrapeQueryKey = 'open-graph-scrape';

export const normalizeArchiveKind = (text: string) => Object.values(ArchiveKind).find(item => item === text) || ArchiveKind.Articles;

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

export const slugify = (string: string) => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};
