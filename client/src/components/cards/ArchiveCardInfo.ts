import { ArchiveKind, UserLike } from "../../common/Models";

export enum CardStyle {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface ArchiveCardInfo {
    id: string;
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
