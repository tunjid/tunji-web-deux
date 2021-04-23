import { createStyles, makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Chip } from "@material-ui/core";
import { CardInfo } from "./HomeCard";


const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: 'flex',
        'justify-content': 'space-between'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    date: {
        display: 'flex',
    },
}));

interface Props {
    cardInfo: CardInfo
}

const HomeCardBody = ({cardInfo}: Props) => {
    const classes = useStyles();

    return (
        <CardContent>
            <div className={classes.root}>
                <div className={classes.chips}>
                    {cardInfo.categories.map((label) => <Chip
                        label={label}
                        color="secondary"
                        size="small"/>
                    )}
                </div>
                <div className={classes.date}>
                    <Typography gutterBottom variant="caption" component="p">
                        {cardInfo.date}
                    </Typography>
                </div>
            </div>
            <Typography gutterBottom variant="h4" component="h2">
                {cardInfo.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
                {cardInfo.body}
            </Typography>
        </CardContent>
    );
}

export default HomeCardBody;
