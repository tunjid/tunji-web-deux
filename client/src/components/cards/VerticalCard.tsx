import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { CardInfo } from "./CardInfo";
import CardBody from "./CardBody";


const useStyles = makeStyles((theme) => createStyles({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    media: {
        minHeight: 140,
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
    cardInfo: CardInfo;
    onClick: () => void;
}

const VerticalCard = ({cardInfo, onClick}: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.root} onClick={onClick}>
            <CardMedia
                className={classes.media}
                image={cardInfo.thumbnail}
                title={cardInfo.title}
            />
            <CardBody cardInfo={cardInfo}/>
        </Card>
    );
}

export default VerticalCard;
