import { ArchiveKind, ArchiveLike, Author } from '@tunji-web/common';

export interface PopulatedArchive {
    key: string,
    link: string;
    title: string;
    body: string;
    description: string;
    thumbnail?: string;
    videoUrl?: string;
    author: Author,
    created: Date;
    likes: number;
    spanCount?: number;
    tags: string[];
    categories: string[];
    kind: ArchiveKind,
}

export function toArchive(populatedArchive: PopulatedArchive): ArchiveLike {
    return {...populatedArchive, author: populatedArchive.author.id};
}
