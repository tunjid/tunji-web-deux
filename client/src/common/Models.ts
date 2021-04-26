export interface UserLike {
    id: string;
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
    author: Author,
    created: Date;
    spanCount?: number;
    tags: string[];
    categories: string[];
    kind: ArchiveKind,
}

export type Author = UserLike;

export enum ArchiveKind {
    Articles = 'articles',
    Projects = 'projects',
    Talks = 'talks',
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
    title: '',
    body: '',
    description: '',
    author: EmptyUser,
    created: new Date(),
    tags: [],
    categories: [],
    kind: ArchiveKind.Articles,
};
