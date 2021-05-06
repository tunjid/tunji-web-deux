import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import ArchiveCards from "../cards/ArchiveCards";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveKind, ArchiveSummary } from "../../client-server-common/Models";
import { ArchiveState } from "../../reducers/Archive";
import { RouterState } from "connected-react-router";
import { theme } from "../../styles/PersistentUi";
import { ArchiveActions, ArchivesQuery } from "../../actions/Archive";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import _ from 'lodash';
import { StylelessAnchor, verticalMargin } from "../../styles/Common";
import { archivesSelector, capitalizeFirst, ShortMonthNames } from "../common/Common";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { describeRoute } from "../../client-server-common/RouteUtilities";

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            'flex-direction': 'row',
            'justify-content': 'center'
        },
        cards: {
            width: 'auto',
            position: 'relative',
        },
        gutter: {
            display: 'flex',
            flexDirection: 'column',
            ...verticalMargin(theme.spacing(4)),
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
        const lookup = describeRoute(routerState.location.pathname).archiveLookup;
        const kind = lookup?.kind || ArchiveKind.Articles;

        return {
            kind,
            summaries: archiveState.summariesMap[kind],
        }
    }
);

const querySelector = createSelector<StoreState, RouterState, ArchivesQuery>(
    state => state.router,
    (routerState) => {
        const lookup = describeRoute(routerState.location.pathname).archiveLookup;
        const kind = lookup?.kind || ArchiveKind.Articles;

        return {
            kind,
            key: `ArchiveList-${kind}`,
            params: routerState.location.query,
        }
    }
);

const ArchiveList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {kind, summaries} = useSelector(selector, shallowEqual);
    const query = useSelector(querySelector, shallowEqual);
    const archives = useSelector(archivesSelector(querySelector), shallowEqual);

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
            <div className={classes.cards}>
                <ArchiveCards kind={kind} archives={archives}/>
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
