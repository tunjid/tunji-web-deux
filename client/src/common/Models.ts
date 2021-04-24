export interface UserLike {
    firstName: string;
    lastName: string;
    fullName: string;
    imageUrl: string;
}

export interface ArchiveLike {
    key: string,
    title: string;
    body: string;
    description: string;
    thumbnail?: string;
    author: UserLike,
    created: Date;
    spanCount?: number;
    tags: string[];
    categories: string[];
    kind: ArchiveKind,
}

export enum ArchiveKind {
    Articles = 'articles',
    Projects = 'projects',
    Talks = 'talks',
}
