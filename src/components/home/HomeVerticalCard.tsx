import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { CardInfo } from "./HomeCard";
import HomeCardBody from "./HomeCardBody";


const useStyles = makeStyles((theme) => createStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    info: {
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

const HomeVerticalCard = ({cardInfo}: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={cardInfo.thumbnail}
                    title={cardInfo.title}
                />
                <HomeCardBody cardInfo={cardInfo}/>
            </CardActionArea>
        </Card>
    );
}

export default HomeVerticalCard;
