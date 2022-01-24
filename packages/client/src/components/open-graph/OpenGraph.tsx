import { createStyles, makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { horizontalMargin, StylelessAnchor } from '../../styles/Common';
import { OpenGraphData, OpenGraphState } from '@tunji-web/client/src/reducers/OpenGraph';
import { useDispatch } from 'react-redux';
import { StoreState } from '@tunji-web/client';
import { OpenGraphActions } from '@tunji-web/client/src/actions/OpenGraph';
import { createSelector } from 'reselect';
import { useDeepEqualSelector } from '@tunji-web/client/src/hooks/UseDeepEqualSelector';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        anchor: {
            ...StylelessAnchor,
            '& > *': {
                ...horizontalMargin(theme.spacing(1)),
            },
            display: 'flex'
        },
        cardRoot: {
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

interface State {
    openGraphData?: OpenGraphData
}

const selector = (url: string) => createSelector<StoreState, OpenGraphState, State>(
    state => state.openGraph,
    (openGraphState) => ({openGraphData: openGraphState.graphData[url]})
);

interface Props {
    url: string
}

const OpenGraphCard = ({url}: Props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {openGraphData} = useDeepEqualSelector(selector(url));

    useEffect(() => {
        dispatch(OpenGraphActions.openGraphScrape(url));
    }, [url, dispatch]);


    const node = openGraphData
        ? <a className={classes.anchor}
             href={url}
             target="_blank"
             rel="noreferrer"
        >
            <Paper className={classes.cardRoot} variant="outlined">
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
        : <Link to={url}/>;

    return <div className={classes.root}>{node}</div>;
};

export default OpenGraphCard;
