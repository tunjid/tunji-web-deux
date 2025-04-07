import { ArchiveKind, UserLike } from '@tunji-web/common';
import { GridSize } from '@mui/material/Grid/Grid';
import { Breakpoint } from '@mui/material/styles';

export type GridBreakPoint = GridSize | Array<GridSize | null> | { [key in Breakpoint]?: GridSize | null };

export interface ArchiveCardInfo {
    id: string;
    link: string;
    title: string;
    description: string;
    thumbnail: string;
    date?: string;
    readTime: string;
    showThumbnail: boolean;
    categories: string[];
    breakPoints: GridBreakPoint,
    kind: ArchiveKind,
    author: UserLike;
}

