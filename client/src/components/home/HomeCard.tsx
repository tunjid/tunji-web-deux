import HorizontalCard from "../cards/HorizontalCard";
import VerticalCard from "../cards/VerticalCard";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CardInfo, CardStyle } from "../cards/CardInfo";
import { ArchiveKind } from "../../common/Models";
import { RouterActions } from "../../actions/Router";

const useStyles = makeStyles(() => createStyles({
        root: {
            margin: '8px',
        },
    }
));

interface Props {
    kind: ArchiveKind,
    cardInfo: CardInfo
}

export default function AppCard({kind, cardInfo}: Props) {
    const classes = useStyles();
    const onClick = () => RouterActions.push(`${kind}/${cardInfo.id}`);
    const element = cardInfo.style === CardStyle.horizontal
        ? <HorizontalCard cardInfo={cardInfo} onClick={onClick}/>
        : <VerticalCard cardInfo={cardInfo} onClick={onClick}/>

    return (<div className={classes.root}>{element}</div>);
}
