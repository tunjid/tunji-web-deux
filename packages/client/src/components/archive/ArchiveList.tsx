import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { StoreState } from '../../types';
import { ArchiveKind, ArchiveLike, ArchiveSummary, describeRoute } from '@tunji-web/common';
import { ArchiveState } from '../../reducers/Archive';
import { ArchiveActions, ArchivesQuery } from '../../actions/Archive';
import _ from 'lodash';
import { archivesSelector, capitalizeFirst, ShortMonthNames } from '../common/Common';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import ChipInput, { ChipType } from './ChipInput';
import { RouterActions } from '../../actions/Router';
import { Box, CircularProgress, Divider, Link as MuiLink, styled, Typography, } from '@mui/material';
import ArchiveCards from '../cards/ArchiveCards';
import AppAppBar from '@tunji-web/client/src/blog/components/AppAppBar';
import Container from '@mui/material/Container';

const ChipsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
}));

const ProgressBarContainer = styled(Box)(({theme}) => ({
    width: 'auto',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    margin: theme.spacing(8, 0),
}));

const GutterColumn = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('md')]: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}));

const GutterLink = styled(MuiLink)(({theme}) => ({
    margin: theme.spacing(1, 0),
    textDecoration: 'underline',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const GutterDivider = styled(Divider)(({theme}) => ({
    margin: theme.spacing(2, 0),
}));

interface State {
    kind: ArchiveKind;
    queryTags: string[];
    queryCategories: string[];
    availableCategories: string[];
    summaries: ArchiveSummary[];
}

const stateSelector = (pathname: string, searchParams: URLSearchParams) =>
    createSelector<StoreState, State, ArchiveState>(
        [
            (state) => state.archives
        ],
        (archiveState) => {
            const params = new URLSearchParams(searchParams);
            const queryTags = params.getAll(ChipType.Tag);
            const queryCategories = params.getAll(ChipType.Category);
            const kind = describeRoute(pathname).kind || ArchiveKind.Articles;

            return {
                kind,
                queryTags,
                queryCategories,
                availableCategories: _.uniq(
                    _.flatten(archiveState.kindToArchivesMap[kind].map((archive) => archive.categories))
                ),
                summaries: archiveState.summariesMap[kind],
            };
        }
    );

const createQuerySelector = (pathname: string, searchParams: URLSearchParams) =>
    createSelector<StoreState, ArchivesQuery>(() => {
        const kind = describeRoute(pathname).kind || ArchiveKind.Articles;
        const params = new URLSearchParams(searchParams);
        params.delete('limit');
        params.append('limit', '13');
        params.append('populateAuthor', 'true');

        return {
            kind,
            params,
            key: `ArchiveList-${kind}`,
        };
    });

const ArchiveList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const selector = stateSelector(location.pathname, searchParams);
    const querySelector = createQuerySelector(location.pathname, searchParams);
    const {kind, queryTags, queryCategories, availableCategories, summaries} =
        useDeepEqualSelector(selector);
    const query = useDeepEqualSelector(querySelector);
    const archives = useDeepEqualSelector(archivesSelector(querySelector));
    const offset = useDeepEqualSelector(
        createSelector<StoreState, ArchiveLike[], number>(
            archivesSelector(querySelector),
            (archives) => archives.length
        )
    );
    const isLoading = useDeepEqualSelector(
        createSelector<StoreState, ArchivesQuery, ArchiveState, boolean>(
            querySelector,
            (state) => state.archives,
            (query, archiveState) => archiveState.archivesFetchStatus[query.key]
        )
    );

    const [loader, setLoader] = useState<HTMLDivElement | undefined>(undefined);
    const loaderRef = useCallback((node) => {
        if (node !== null) setLoader(node);
    }, []);

    const loadMore = useCallback(
        (entries) => {
            const target = entries[0];
            if (!target.isIntersecting || isLoading) return;

            const params = query.params;
            params.delete('offset');
            params.append('offset', `${offset}`);
            dispatch(ArchiveActions.fetchArchives({...query, params}));
        },
        [isLoading, query, offset, dispatch]
    );

    const title = `Tunji's ${capitalizeFirst(kind)}`;

    useEffect(() => {
        dispatch(ArchiveActions.fetchArchives(query));
    }, [query, dispatch]);

    useEffect(() => {
        dispatch(ArchiveActions.archiveSummaries(kind));
    }, [kind, dispatch]);

    useEffect(() => {
        const options = {
            root: null, // window by default
            rootMargin: '0px',
            threshold: 0.25,
        };

        const observer = new IntersectionObserver(loadMore, options);
        if (loader) observer.observe(loader);

        // clean up on willUnMount
        return () => {
            if (loader) observer.unobserve(loader);
        };
    }, [loader, loadMore]);

    const progressNode = isLoading ? <CircularProgress/> : <div/>;

    const categoryNodes = availableCategories.map((category) => (
        <GutterLink key={category} component={Link} to={`/${kind}/?category=${category}`}>
            <Typography variant={'caption'}>
                {category}
            </Typography>
        </GutterLink>
    ));

    const summaryNodes = summaries.map(({dateInfo, titles}) => (
        <GutterLink
            key={JSON.stringify(dateInfo)}
            component={Link}
            to={`/${kind}/?dateInfo=${dateInfo.year}-${dateInfo.month}`}
        >
            <Typography variant={'caption'}>
                {`${ShortMonthNames[dateInfo.month]} ${dateInfo.year} (${titles.length})`}
            </Typography>
        </GutterLink>
    ));

    const navigate = useNavigate();
    const chipEditor = (type: ChipType, isAdd: boolean) => (chip: string) => {
        const params = new URLSearchParams(query.params.toString());
        if (isAdd) params.append(type, chip);
        else {
            const filtered = params.getAll(type).filter((item) => item !== chip);
            params.delete(type);
            filtered.forEach((item) => params.append(type, item));
        }

        navigate(`/${kind}?${params.toString()}`);
    };

    return (
        <div>
            <AppAppBar
                links={[
                    {title: 'Home', link: '/'},
                    {title: 'About', link: '/about'}
                ]}
            />
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', overflow: 'auto'}}>
                <Box sx={{flex: 1}}/>
                <Container
                    maxWidth="md"
                    component="main"
                    sx={{display: 'flex', flexGrow: 1, flexDirection: 'column', my: 16, gap: 4}}
                >
                    <Helmet>
                        <title>{title}</title>
                        <meta name="description" content={title}/>
                    </Helmet>
                    <ChipsContainer>
                        <ChipInput
                            name="Categories: "
                            type={ChipType.Category}
                            kind={kind}
                            chips={queryCategories}
                            editor={{
                                onChipAdded: chipEditor(ChipType.Category, true),
                                onChipDeleted: chipEditor(ChipType.Category, false),
                            }}
                        />
                        <Typography component="p" sx={{my: 1}}>&</Typography>
                        <ChipInput
                            name="Tags: "
                            type={ChipType.Tag}
                            kind={kind}
                            chips={queryTags}
                            editor={{
                                onChipAdded: chipEditor(ChipType.Tag, true),
                                onChipDeleted: chipEditor(ChipType.Tag, false),
                            }}
                        />
                    </ChipsContainer>
                    <ArchiveCards kind={kind} archives={archives}/>
                    <ProgressBarContainer ref={loaderRef}>{progressNode}</ProgressBarContainer>
                </Container>
                <Box sx={{flex: 1, my: 16}}>
                    <Box sx={{
                        position: 'fixed',
                        maxWidth: 200,
                        flexDirection: 'column',
                        display: {xs: 'none', sm: 'none', md: 'none', lg: 'block'}
                    }}>
                        <Typography gutterBottom variant="h5">
                            Categories
                        </Typography>
                        {categoryNodes}

                        <Divider/>
                        <Typography gutterBottom variant="h5">
                            Timeline
                        </Typography>
                        {summaryNodes}
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default ArchiveList;