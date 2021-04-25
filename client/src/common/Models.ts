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

export const EmptyUser: UserLike = {
    firstName: '',
    lastName: '',
    fullName: '',
    imageUrl: '',
};

export const EmptyArchive : ArchiveLike = {
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
