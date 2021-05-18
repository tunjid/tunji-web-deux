import { createStyles, makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import * as React from "react";
import { useEffect, useState } from "react";
import ApiService from "../../rest/ApiService";
import { Link } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { horizontalMargin, StylelessAnchor } from "../../styles/Common";

export interface OpenGraphData {
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterCard: string;
    twitterSiteId: string;
    ogSiteName: string,
    ogImage: OgImage;
    twitterImage: TwitterImage;
    ogLocale: string;
    charset: string;
    requestUrl: string;
    success: boolean;
}

export interface OgImage {
    url: string;
    width?: null;
    height?: null;
    type: string;
}

export interface TwitterImage {
    url: string;
    width?: null;
    height?: null;
    alt?: null;
}


const useStyles = makeStyles((theme) =>
    createStyles({
        anchor: {
            ...StylelessAnchor,
            '& > *': {
                ...horizontalMargin(theme.spacing(1)),
            },
            display: 'flex'
        },
        root: {
            display: 'flex',
            margin: '0 auto',
            width: '100%',
            justifyContent: 'space-between'
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            width: '100%',

            ...horizontalMargin(theme.spacing(2)),
        },
        cover: {
            minWidth: 151,
            minHeight: 151,
        },
    }),
);

const truncate = (input: string) => input.length > 80 ? `${input.substring(0, 80)}...` : input;

interface Props {
    url: string
}

const OpenGraphCard = ({url}: Props) => {
    const classes = useStyles();
    const [openGraphData, setOpenGraphData] = useState<OpenGraphData | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.scrapeOpenGraph(url);
                setOpenGraphData(response.data);
            } catch (err: any) {
            }
        };

        fetchData();
    }, [url]);


    const node = openGraphData
        ? <a className={classes.anchor}
             href={url}
             target="_blank"
             rel="noreferrer"
        >
            <Paper className={classes.root} variant="outlined">
                <div className={classes.details}>
                    <Typography component="h5" variant="h5">
                        {openGraphData?.ogTitle ? truncate(openGraphData?.ogTitle) : ''}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {openGraphData?.ogDescription ? truncate(openGraphData?.ogDescription) : ''}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {openGraphData?.ogSiteName ? truncate(openGraphData?.ogSiteName) : ''}
                    </Typography>
                </div>
                <CardMedia
                    className={classes.cover}
                    image={openGraphData?.ogImage?.url}
                    title="Live from space album cover"
                />
            </Paper>
        </a>
        : <Link to={url}/>

    return node;
};

export default OpenGraphCard;
