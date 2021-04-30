import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ArchiveCardInfo, CardStyle } from "./ArchiveCardInfo";
import { ArchiveKind } from "../../common/Models";
import React, { HTMLAttributes } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import ArchiveCardBody from "./ArchiveCardBody";

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
            minWidth: 200,
        },
    }
));

interface State extends HTMLAttributes<any> {
    kind: ArchiveKind,
    cardInfo: ArchiveCardInfo
}

export default function ArchiveCard({kind, cardInfo}: State) {
    const classes = useStyles();
    const isHorizontal = cardInfo.style === CardStyle.horizontal;

    return (
        <div className={classes.root}>
            <Card className={isHorizontal ? classes.horizontalRoot : classes.verticalRoot}>
                <a className={isHorizontal ? classes.horizontalMedia : classes.verticalMedia}
                   href={`/${kind}/${cardInfo.link}`}>
                    <CardMedia
                        className={isHorizontal ? classes.horizontalImage : classes.verticalImage}
                        image={cardInfo.thumbnail}
                        title={cardInfo.title}
                    />
                </a>
                <div className={classes.body}>
                    <ArchiveCardBody cardInfo={cardInfo}/>
                </div>
            </Card>
        </div>
    );
}
