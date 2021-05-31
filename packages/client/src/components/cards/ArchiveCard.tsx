import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ArchiveCardInfo, CardStyle } from "./ArchiveCardInfo";
import { ArchiveKind } from '@tunji-web/common';
import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import ArchiveCardBody from "./ArchiveCardBody";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => createStyles({
        root: {
            padding: '8px',
            height: '100%'
        },
        horizontalRoot: {
            height: '100%',
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
            minHeight: 240,
        },
        verticalImage: {
            minHeight: 220,
        },
        body: {
            height: '100%',
            minWidth: 200,
        },
    }
));

interface State {
    kind: ArchiveKind,
    cardInfo: ArchiveCardInfo
}

export default function ArchiveCard({kind, cardInfo}: State) {
    const classes = useStyles();
    const isHorizontal = cardInfo.style === CardStyle.horizontal;

    return (
        <div className={classes.root}>
            <Card className={isHorizontal ? classes.horizontalRoot : classes.verticalRoot}>
                <Link className={isHorizontal ? classes.horizontalMedia : classes.verticalMedia}
                   to={`/${kind}/${cardInfo.link}`}>
                    <CardMedia
                        className={isHorizontal ? classes.horizontalImage : classes.verticalImage}
                        image={cardInfo.thumbnail}
                        title={cardInfo.title}
                    />
                </Link>
                <div className={classes.body}>
                    <ArchiveCardBody cardInfo={cardInfo}/>
                </div>
            </Card>
        </div>
    );
}
