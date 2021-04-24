import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { CardInfo } from "./CardInfo";
import CardBody from "./CardBody";


const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: 'flex',
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

const VerticalCard = ({cardInfo}: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={cardInfo.thumbnail}
                    title={cardInfo.title}
                />
                <CardBody cardInfo={cardInfo}/>
            </CardActionArea>
        </Card>
    );
}

export default VerticalCard;
