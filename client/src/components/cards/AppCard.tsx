import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CardInfo, CardStyle } from "../cards/CardInfo";
import { ArchiveKind } from "../../common/Models";
import { RouterActions } from "../../actions/Router";
import { useDispatch } from "react-redux";
import React, { HTMLAttributes } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardBody from "../cards/CardBody";

const useStyles = makeStyles(() => createStyles({
        root: {
            padding: '8px',
            height: '100%'
        },
        horizontalRoot: {
            display: 'flex',
            minHeight: '20vh',
        },
        verticalRoot: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        horizontalImage: {
            width: '60vw',
        },
        verticalImage: {
            minHeight: 200,
        },
    }
));

interface Props extends HTMLAttributes<any> {
    kind: ArchiveKind,
    cardInfo: CardInfo
}

export default function AppCard({kind, cardInfo}: Props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isHorizontal = cardInfo.style === CardStyle.horizontal;
    const onClick = () => dispatch(RouterActions.push(`/${kind}/${cardInfo.id}`));

    return (
        <div className={classes.root}>
            <Card className={isHorizontal ? classes.horizontalRoot : classes.verticalRoot} onClick={onClick}>
                <CardMedia
                    className={isHorizontal ? classes.horizontalImage : classes.verticalImage}
                    image={cardInfo.thumbnail}
                    title={cardInfo.title}
                />
                <CardBody cardInfo={cardInfo}/>
            </Card>
        </div>
    );
}
