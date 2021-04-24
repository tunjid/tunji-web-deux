import HorizontalCard from "../cards/HorizontalCard";
import VerticalCard from "../cards/VerticalCard";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CardInfo, CardStyle } from "../cards/CardInfo";

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
        : <VerticalCard cardInfo={cardInfo}/>

    return (<div className={classes.root}>{element}</div>);
}
