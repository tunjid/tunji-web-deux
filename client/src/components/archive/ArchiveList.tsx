import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import ArchiveCards from "../cards/ArchiveCards";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveKind, ArchiveLike, ArchiveSummary } from "../../common/Models";
import { ArchiveState } from "../../reducers/Archive";
import { RouterState } from "connected-react-router";
import { theme } from "../../styles/PersistentUi";
import { ArchiveActions } from "../../actions/Archive";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import _ from 'lodash';

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
            'margin-top': theme.spacing(4),
            'margin-bottom': theme.spacing(4),
        },
        gutterDivider: {
            'margin-top': theme.spacing(2),
            'margin-bottom': theme.spacing(2),
        },
    }
));

interface State {
    kind: ArchiveKind,
    archives: ArchiveLike[];
    summaries: ArchiveSummary[];
    queryParams: Record<string, string>;
}

const selector = createSelector<StoreState, RouterState, ArchiveState, State>(
    state => state.router,
    state => state.archives,
    (routerState, archiveState) => {
        const kind = routerState.location.pathname.split('/')[1] as ArchiveKind;
        return {
            kind,
            summaries: archiveState.summariesMap[kind],
            archives: archiveState.kindToArchivesMap[kind],
            queryParams: routerState.location.query,
        }
    }
);

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {kind, summaries, archives}: State = useSelector(selector, shallowEqual);

    const categories = _.uniq(_.flatten(archives.map(archive => archive.categories)));

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
                appBarColor: theme.palette.primary.main,
                appBarTitle: kind,
                hasAppBarSpacer: true,
                menuItems: []
            }
        ));
    }, [kind, dispatch]);

    useEffect(() => {
        dispatch(ArchiveActions.archiveSummaries(kind));
    }, [kind, dispatch]);

    const categoryNodes = categories.map(category => {
        return <p key={category}>{category}</p>
    });

    const summaryNodes = summaries.map(({dateInfo, titles}) => {
        const date = new Date(dateInfo.year, dateInfo.month);
        return <p key={JSON.stringify(dateInfo)}>{`${date.toDateString()} (${titles.length})`}</p>
    });

    return (
        <div className={classes.root}>
            <div className={classes.cards}>
                <ArchiveCards kind={kind}/>
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

export default Home;
