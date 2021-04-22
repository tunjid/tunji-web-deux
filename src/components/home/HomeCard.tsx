import HorizontalCard from "./HomeHorizontalCard";
import HomeVerticalCard from "./HomeVerticalCard";

export enum CardStyle {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface CardInfo {
    id: string;
    title: string;
    body: string;
    thumbnail: string;
    date?: string;
    spanCount?: number;
    style: CardStyle;
    categories: string[];
}

interface Props {
    cardInfo: CardInfo
}

export default function AppCard({cardInfo}: Props) {
    const element = cardInfo.style === CardStyle.horizontal
        ? <HorizontalCard cardInfo={cardInfo}/>
        : <HomeVerticalCard cardInfo={cardInfo}/>

    return (<div>{element}</div>);
}
