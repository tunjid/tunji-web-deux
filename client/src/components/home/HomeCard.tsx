import HorizontalCard from "./HomeHorizontalCard";
import HomeVerticalCard from "./HomeVerticalCard";
import { UserLike } from "../../../../common/Models";
import { createStyles, makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles(() => createStyles({
        root: {
            margin: '8px',
        },
    }
));

interface Props {
    cardInfo: CardInfo
}

export default function AppCard({cardInfo}: Props) {
    const classes = useStyles();
    const element = cardInfo.style === CardStyle.horizontal
        ? <HorizontalCard cardInfo={cardInfo}/>
        : <HomeVerticalCard cardInfo={cardInfo}/>

    return (<div className={classes.root}>{element}</div>);
}
