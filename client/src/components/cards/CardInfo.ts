import { UserLike } from "../../common/Models";

export enum CardStyle {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface CardInfo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    date?: string;
    spanCount?: number;
    categories: string[];
    style: CardStyle;
    author: UserLike;
}
