import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export enum CardStyle {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface CardInfo {
    id: string;
    title: string;
    body: string;
    thumbnail: string;
    date?: string;
    spanCount?: number;
    style: CardStyle;
    categories: string[];
}

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

interface Props {
    cardInfo: CardInfo
}

export default function AppCard({cardInfo}: Props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={cardInfo.thumbnail}
                    title={cardInfo.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {cardInfo.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {cardInfo.body}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
                <Button size="small" color="primary">
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
}
