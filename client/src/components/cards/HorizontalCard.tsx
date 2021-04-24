import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { CardInfo } from "./CardInfo";
import CardBody from "./CardBody";

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
    cardInfo: CardInfo;
    onClick: () => void;
}

const HorizontalCard = ({cardInfo, onClick}: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.root} onClick={onClick}>
            <CardMedia
                className={classes.cover}
                image={cardInfo.thumbnail}
                title={cardInfo.title}
            />
            <CardBody cardInfo={cardInfo}/>
        </Card>
    );
}

export default HorizontalCard
