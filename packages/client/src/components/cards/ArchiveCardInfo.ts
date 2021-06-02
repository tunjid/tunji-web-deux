import { ArchiveKind, UserLike } from '@tunji-web/common';

export enum CardStyle {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface ArchiveCardInfo {
    id: string;
    link: string;
    title: string;
    description: string;
    thumbnail: string;
    date?: string;
    spanCount: number;
    readTime: string;
    categories: string[];
    kind: ArchiveKind,
    style: CardStyle;
    author: UserLike;
}
