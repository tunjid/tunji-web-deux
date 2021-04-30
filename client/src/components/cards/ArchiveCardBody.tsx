import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Avatar } from "@material-ui/core";
import { ArchiveCardInfo } from "./ArchiveCardInfo";
import ChipInput, { ChipType } from "../archive/ChipInput";
import * as React from "react";
import { horizontalMargin, StylelessAnchor, verticalMargin } from "../../styles/Common";

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
        ...horizontalMargin(theme.spacing(0.5)),
    },
    titleColumn: {
        ...StylelessAnchor,
        ...horizontalMargin(theme.spacing(0.5)),
        ...verticalMargin(theme.spacing(0.5)),
    },
    authorRow: {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        ...horizontalMargin(theme.spacing(0.5)),
        'margin-top': 'auto',
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

interface State {
    cardInfo: ArchiveCardInfo
}

const ArchiveCardBody = ({cardInfo}: State) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
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
            <a className={classes.titleColumn} href={`/${cardInfo.kind}/${cardInfo.id}`}>
                <Typography gutterBottom variant="h5">
                    {cardInfo.title}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                    {cardInfo.description}
                </Typography>
            </a>
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
        </div>
    );
}

export default ArchiveCardBody;
