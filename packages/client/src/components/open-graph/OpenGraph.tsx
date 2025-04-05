import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OpenGraphData, OpenGraphState } from '@tunji-web/client/src/reducers/OpenGraph';
import { useDispatch } from 'react-redux';
import { StoreState } from '@tunji-web/client';
import { OpenGraphActions } from '@tunji-web/client/src/actions/OpenGraph';
import { createSelector } from 'reselect';
import { useDeepEqualSelector } from '@tunji-web/client/src/hooks/UseDeepEqualSelector';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

const truncate = (input: string) => input.length > 80 ? `${input.substring(0, 80)}...` : input;

interface State {
    openGraphData?: OpenGraphData;
}

const selector = (url: string) => createSelector<StoreState, State, OpenGraphState>(
    state => state.openGraph,
    (openGraphState) => ({openGraphData: openGraphState.graphData[url]})
);

interface Props {
    url: string;
}

const OpenGraphCard = ({url}: Props) => {
    const dispatch = useDispatch();
    const {openGraphData} = useDeepEqualSelector(selector(url));

    useEffect(() => {
        dispatch(OpenGraphActions.openGraphScrape(url));
    }, [url, dispatch]);


    const node = openGraphData
        ? <a
            href={url}
            target="_blank"
            rel="noreferrer"
        >
            <Paper variant="outlined">
                <div>
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
                    image={openGraphData?.ogImage?.url}
                    title="Live from space album cover"
                />
            </Paper>
        </a>
        : <Link to={url}/>;

    return <div>{node}</div>;
};

export default OpenGraphCard;
