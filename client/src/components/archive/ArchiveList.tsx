import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import ArchiveCards from "../cards/ArchiveCards";
import { useDispatch } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveKind, ArchiveLike, ArchiveSummary } from "../../client-server-common/Models";
import { ArchiveState } from "../../reducers/Archive";
import { RouterState } from "connected-react-router";
import { theme } from "../../styles/PersistentUi";
import { ArchiveActions, ArchivesQuery } from "../../actions/Archive";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Divider } from "@material-ui/core";
import _ from 'lodash';
import { horizontalMargin, StylelessAnchor, verticalMargin } from "../../styles/Common";
import { archivesSelector, capitalizeFirst, ShortMonthNames } from "../common/Common";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { describeRoute } from "../../client-server-common/RouteUtilities";
import { useDeepEqualSelector } from "../../hooks/UseDeepEqualSelector";

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
            width: 'auto',
            position: 'relative',
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
        gutter: {
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
    summaries: ArchiveSummary[];
}

const selector = createSelector<StoreState, RouterState, ArchiveState, State>(
    state => state.router,
    state => state.archives,
    (routerState, archiveState) => {
        const kind = describeRoute(routerState.location.pathname).kind || ArchiveKind.Articles;

        return {
            kind,
            summaries: archiveState.summariesMap[kind],
        }
    }
);

const querySelector = createSelector<StoreState, RouterState, ArchivesQuery>(
    state => state.router,
    (routerState) => {
        const kind = describeRoute(routerState.location.pathname).kind || ArchiveKind.Articles;

        return {
            kind,
            key: `ArchiveList-${kind}`,
            params: {...routerState.location.query, limit: '13'},
        }
    }
);

const ArchiveList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {kind, summaries} = useDeepEqualSelector(selector);
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

        const params = {...query.params, offset: `${offset}`}
        dispatch(ArchiveActions.fetchArchives({...query, params}));
    }, [isLoading, query, offset, dispatch]);

    const title = `Tunji's ${capitalizeFirst(kind)}`;
    const categories = _.uniq(_.flatten(archives.map(archive => archive.categories)));

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

    const categoryNodes = categories.map(category =>
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

    return (
        <div className={classes.root}>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={title}/>
            </Helmet>
            <div className={classes.contentColumn}>
                <ArchiveCards kind={kind} archives={archives}/>
                <div ref={loaderRef} className={classes.progressBar}>
                    {progressNode}
                </div>
            </div>
            <div className={classes.gutter}>
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
}

export default ArchiveList;
