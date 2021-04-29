import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Avatar, Chip } from "@material-ui/core";
import { CardInfo } from "./CardInfo";
import ChipInput, { ChipType } from "../archive/ChipInput";
import * as React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        height: '100%',
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        'color': 'inherit',
        'text-decoration': 'none',
    },
    metadata: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        'align-items': 'center',
        'justify-content': 'space-between',
        margin: theme.spacing(0.5),
    },
    avatarRow: {
        display: 'flex',
        flexWrap: 'wrap',
        'align-items': 'center',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    date: {
        display: 'flex',
    },
    description: {
        'margin-left': theme.spacing(0.5),
        'margin-right': theme.spacing(0.5),
    },
    titleColumn: {
        'margin-left': theme.spacing(0.5),
        'margin-right': theme.spacing(0.5),
        'margin-top': theme.spacing(1),
        'margin-bottom': theme.spacing(1),
    },
    authorRow: {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        'margin-left': theme.spacing(0.5),
        'margin-right': theme.spacing(0.5),
        'margin-top': 'auto',
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

interface Props {
    cardInfo: CardInfo
}

const CardBody = ({cardInfo}: Props) => {
    const classes = useStyles();

    return (
        <a className={classes.root} href={`/${cardInfo.kind}/${cardInfo.id}`}>
            <div className={classes.metadata}>
                <ChipInput
                    name=''
                    type={ChipType.Category}
                    kind={cardInfo.kind}
                    chips={cardInfo.categories}
                />
                <div className={classes.date}>
                    <Typography gutterBottom variant="caption" component="p">
                        {cardInfo.date}
                    </Typography>
                </div>
            </div>
            <div className={classes.titleColumn}>
                <Typography gutterBottom variant="h5">
                    {cardInfo.title}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                    {cardInfo.description}
                </Typography>
            </div>
            <div className={classes.authorRow}>
                <div className={classes.avatarRow}>
                    <Avatar className={classes.avatar} src={cardInfo.author.imageUrl}/>
                    <Typography variant="body1" color="textSecondary" component="p">
                        {cardInfo.author.fullName}
                    </Typography>
                </div>
                <div className={classes.date}>
                    <Typography gutterBottom variant="caption" component="p">
                        {cardInfo.readTime.toUpperCase()}
                    </Typography>
                </div>
            </div>
        </a>
    );
}

export default CardBody;
