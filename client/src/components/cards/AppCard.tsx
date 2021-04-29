import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CardInfo, CardStyle } from "../cards/CardInfo";
import { ArchiveKind } from "../../common/Models";
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
        horizontalMedia: {
            display: 'block',
            maxWidth: '60%'
        },
        verticalMedia: {
            display: 'block',
        },
        horizontalImage: {
            width: '60vw',
            maxWidth: '100%',
            height: '100%',
        },
        verticalImage: {
            minHeight: 200,
        },
        body: {
            height: '100%',
            'color': 'inherit',
            'text-decoration': 'none',
            minWidth: 200,
        },
    }
));

interface Props extends HTMLAttributes<any> {
    kind: ArchiveKind,
    cardInfo: CardInfo
}

export default function AppCard({kind, cardInfo}: Props) {
    const classes = useStyles();
    const isHorizontal = cardInfo.style === CardStyle.horizontal;
    const link = `/${kind}/${cardInfo.id}`;

    return (
        <div className={classes.root}>
            <Card className={isHorizontal ? classes.horizontalRoot : classes.verticalRoot}>
                <a className={isHorizontal ? classes.horizontalMedia : classes.verticalMedia} href={link}>
                    <CardMedia
                        className={isHorizontal ? classes.horizontalImage : classes.verticalImage}
                        image={cardInfo.thumbnail}
                        title={cardInfo.title}
                    />
                </a>
                <a className={classes.body} href={link}>
                    <CardBody cardInfo={cardInfo}/>
                </a>
            </Card>
        </div>
    );
}
