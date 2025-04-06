import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OpenGraphData, OpenGraphState } from '@tunji-web/client/src/reducers/OpenGraph';
import { useDispatch } from 'react-redux';
import { StoreState } from '@tunji-web/client';
import { OpenGraphActions } from '@tunji-web/client/src/actions/OpenGraph';
import { createSelector } from 'reselect';
import { useDeepEqualSelector } from '@tunji-web/client/src/hooks/UseDeepEqualSelector';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

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

    const ogImage = openGraphData
        ? Array.isArray(openGraphData?.ogImage)
            ? openGraphData?.ogImage[0]
            : openGraphData.ogImage
        : null;

    const imageAspectRatio = ogImage ? `${ogImage.width} / ${ogImage.height}` : '1';

    const node = openGraphData
        ? <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{
                textDecoration: 'none'
            }}
        >
            <Card variant="outlined"
                  sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'stretch',
                      gap: 1,
                      padding: 0,
                      justifyContent: 'stretch'
                  }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '2 2 0',
                        gap: 1,
                        padding: 1,
                    }}
                >
                    <Typography variant="subtitle1">
                        {openGraphData?.ogTitle ? truncate(openGraphData?.ogTitle) : ''}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        {openGraphData?.ogDescription ? truncate(openGraphData?.ogDescription) : ''}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {openGraphData?.ogSiteName ? truncate(openGraphData?.ogSiteName) : ''}
                    </Typography>
                </Box>
                <CardMedia
                    sx={{
                        display: 'flex',
                        flex: '1 1 0',
                        aspectRatio: imageAspectRatio,
                    }}
                    image={ogImage?.url}
                    title={openGraphData?.ogDescription}
                />
            </Card>
        </a>
        : <Link to={url}/>;

    return <div>{node}</div>;
};

export default OpenGraphCard;
