import { createStyles, makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Avatar, Chip } from "@material-ui/core";
import { CardInfo } from "./CardInfo";

const useStyles = makeStyles((theme) => createStyles({
    metadata: {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        margin: theme.spacing(0.5),
    },
    chips: {
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
        'margin-top': theme.spacing(2),
        'margin-bottom': theme.spacing(1),
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
        <CardContent>
            <div className={classes.metadata}>
                <div className={classes.chips}>
                    {cardInfo.categories.map((label) => <Chip
                        key={label}
                        label={label}
                        color="secondary"
                        style={{backgroundColor: '#4282F1'}}
                        size="small"/>
                    )}
                </div>
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
                <div className={classes.chips}>
                    <Avatar className={classes.avatar} src={cardInfo.author.imageUrl}/>
                    <Typography variant="body1" color="textSecondary" component="p">
                        {cardInfo.author.fullName}
                    </Typography>
                </div>
                <div className={classes.date}>
                    <Typography gutterBottom variant="caption" component="p">
                        {'X MIN READ'}
                    </Typography>
                </div>
            </div>
        </CardContent>
    );
}

export default CardBody;
