import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { CardInfo } from "./HomeCard";
import HomeCardBody from "./HomeCardBody";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            minHeight: '20vh',
        },
        cover: {
            width: '60vw',
        },
    }),
);

interface Props {
    cardInfo: CardInfo
}

const HorizontalCard = ({cardInfo}: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.cover}
                image={cardInfo.thumbnail}
                title={cardInfo.title}
            />
            <HomeCardBody cardInfo={cardInfo}/>
        </Card>
    );
}

export default HorizontalCard
