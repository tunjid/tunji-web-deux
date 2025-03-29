import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import ArchiveCards from '../cards/ArchiveCards';
import { useDispatch } from 'react-redux';
import { Search } from 'history';
import { PersistentUiActions } from '../../actions/PersistentUi';
import { createSelector } from 'reselect';
import { StoreState } from '../../types';
import { ArchiveKind, ArchiveLike, ArchiveSummary, describeRoute } from '@tunji-web/common';
import { ArchiveState } from '../../reducers/Archive';
import { theme } from '../../styles/PersistentUi';
import { ArchiveActions, ArchivesQuery, ArchiveView } from '../../actions/Archive';
import Typography from '@material-ui/core/Typography';
import { CircularProgress, Divider } from '@material-ui/core';
import _ from 'lodash';
import { horizontalMargin, StylelessAnchor, verticalMargin } from '../../styles/Common';
import { archivesSelector, capitalizeFirst, ShortMonthNames } from '../common/Common';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import ChipInput, { ChipType } from './ChipInput';
import { RouterActions } from '../../actions/Router';

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
            },
        },
        contentColumn: {
            ...horizontalMargin(theme.spacing(4)),
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1080px',
        },
        chips: {
            display: 'flex',
            flexDirection: 'column'
        },
        progressBar: {
            width: 'auto',
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
            ...verticalMargin(theme.spacing(8)),
        },
        gutterColumn: {
            display: 'flex',
            flexDirection: 'column',
            ...verticalMargin(theme.spacing(4)),
            [theme.breakpoints.down('md')]: {
                width: `80%`,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        gutterLink: {
            ...StylelessAnchor,
            ...verticalMargin(theme.spacing(1)),
            textDecoration: 'underline',
        },
        gutterDivider: {
            ...verticalMargin(theme.spacing(2)),
        },
    }
));

interface State {
    kind: ArchiveKind,
    queryTags: string[];
    queryCategories: string[];
    availableCategories: string[];
    summaries: ArchiveSummary[];
}

const createSelector = (pathname: String, searchParams: URLSearchParams) => createSelector<StoreState, ArchiveState, State>(
    state => state.archives,
    (archiveState) => {
        const params = new URLSearchParams(searchParams);
        const queryTags = params.getAll(ChipType.Tag);
        const queryCategories = params.getAll(ChipType.Category);
        const kind = describeRoute(pathname).kind || ArchiveKind.Articles;

        return {
            kind,
            queryTags,
            queryCategories,
            availableCategories: _.uniq(_.flatten(archiveState.kindToArchivesMap[kind].map(archive => archive.categories))),
            summaries: archiveState.summariesMap[kind],
        };
    }
);

const createQuerySelector = (pathname: String, searchParams: URLSearchParams) => createSelector<StoreState, ArchivesQuery>(
    () => {
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
    }
);

const ArchiveList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const selector = createSelector(location.pathname, searchParams);
    const querySelector = createQuerySelector(location.pathname, searchParams);
    const {kind, queryTags, queryCategories, availableCategories, summaries} = useDeepEqualSelector(selector);
    const query = useDeepEqualSelector(querySelector);
    const archives = useDeepEqualSelector(archivesSelector(querySelector));
    const offset = useDeepEqualSelector(createSelector<StoreState, ArchiveLike[], number>(
        archivesSelector(querySelector),
        (archives) => archives.length
    ));
    const isLoading = useDeepEqualSelector(createSelector<StoreState, ArchivesQuery, ArchiveState, boolean>(
        querySelector,
        state => state.archives,
        (query, archiveState) => archiveState.archivesFetchStatus[query.key]
    ));

    const [loader, setLoader] = useState<HTMLDivElement | undefined>(undefined);
    const loaderRef = useCallback(node => {
        if (node !== null) setLoader(node);
    }, []);

    const loadMore = useCallback((entries) => {
        const target = entries[0];
        if (!target.isIntersecting || isLoading) return;

        const params = query.params;
        params.delete('offset');
        params.append('offset', `${offset}`);
        dispatch(ArchiveActions.fetchArchives({...query, params}));
    }, [isLoading, query, offset, dispatch]);

    const title = `Tunji's ${capitalizeFirst(kind)}`;

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
                appBarColor: theme.palette.primary.main,
                appBarTitle: capitalizeFirst(kind),
                hasAppBarSpacer: true,
                hasHomeIcon: true,
                menuItems: []
            }
        ));
    }, [kind, dispatch]);

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
            threshold: 0.25
        };

        const observer = new IntersectionObserver(loadMore, options);
        if (loader) observer.observe(loader);

        // clean up on willUnMount
        return () => {
            if (loader) observer.unobserve(loader);
        };
    }, [loader, loadMore]);

    const progressNode = isLoading ? <CircularProgress/> : <div/>;

    const categoryNodes = availableCategories.map(category =>
        <Link className={classes.gutterLink}
              key={category}
              to={`/${kind}/?category=${category}`}
        >
            {category}
        </Link>
    );

    const summaryNodes = summaries.map(({dateInfo, titles}) =>
        <Link className={classes.gutterLink}
              key={JSON.stringify(dateInfo)}
              to={`/${kind}/?dateInfo=${dateInfo.year}-${dateInfo.month}`}
        >
            {`${ShortMonthNames[dateInfo.month]} ${dateInfo.year} (${titles.length})`}
        </Link>
    );

    const chipEditor = (type: ChipType, isAdd: boolean) => (chip: string) => {
        const params = new URLSearchParams(query.params.toString());
        if (isAdd) params.append(type, chip);
        else {
            const filtered = params.getAll(type).filter(item => item !== chip);
            params.delete(type);
            filtered.forEach(item => params.append(type, item));
        }

        dispatch(RouterActions.push(`/${kind}?${params.toString()}`));
    };

    return (
        <div className={classes.root}>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={title}/>
            </Helmet>
            <div className={classes.contentColumn}>
                <div className={classes.chips}>
                    <ChipInput
                        name="Categories: "
                        type={ChipType.Category}
                        kind={kind}
                        chips={queryCategories}
                        editor={{
                            onChipAdded: chipEditor(ChipType.Category, true),
                            onChipDeleted: chipEditor(ChipType.Category, false)
                        }}
                    />
                    <p>&</p>
                    <ChipInput
                        name="Tags: "
                        type={ChipType.Tag}
                        kind={kind}
                        chips={queryTags}
                        editor={{
                            onChipAdded: chipEditor(ChipType.Tag, true),
                            onChipDeleted: chipEditor(ChipType.Tag, false)
                        }}
                    />
                </div>
                <ArchiveCards kind={kind} archives={archives}/>
                <div ref={loaderRef} className={classes.progressBar}>
                    {progressNode}
                </div>
            </div>
            <div className={classes.gutterColumn}>
                <Typography gutterBottom variant="h5">
                    Categories
                </Typography>
                {categoryNodes}

                <Divider className={classes.gutterDivider}/>

                <Typography gutterBottom variant="h5">
                    Timeline
                </Typography>
                {summaryNodes}
            </div>
            <div/>
        </div>
    );
};

export default ArchiveList;
