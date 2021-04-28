import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import HomeCards from "../home/HomeCards";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveKind, ArchiveLike, ArchiveSummary } from "../../common/Models";
import { ArchiveSearchOptions, ArchiveState } from "../../reducers/Archive";
import { RouterState } from "connected-react-router";
import { theme } from "../../styles/PersistentUi";
import { ArchiveActions } from "../../actions/Archive";

const useStyles = makeStyles(() => createStyles({
        root: {
            display: 'flex',
            'flex-direction': 'row',
        },
        cards: {
            width: '80%',
            position: 'relative',
        },
        gutter: {},
    }
));

interface Props {
    kind: ArchiveKind,
    archives: ArchiveLike[];
    summaries: ArchiveSummary[];
    searchOptions: ArchiveSearchOptions;
}

const selector = createSelector<StoreState, RouterState, ArchiveState, Props>(
    state => state.router,
    state => state.archives,
    (routerState, archiveState) => {
        const kind = routerState.location.pathname.split('/')[1] as ArchiveKind;
        return {
            kind,
            summaries: archiveState.summariesMap[kind],
            archives: archiveState.kindToArchivesMap[kind],
            searchOptions: archiveState.searchOptionsMap[kind],
        }
    }
);

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {kind, summaries}: Props = useSelector(selector, shallowEqual);

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
                appBarColor: theme.palette.primary.main,
                hasAppBarSpacer: true,
                menuItems: []
            }
        ));
    }, [kind, dispatch]);

    useEffect(() => {
        dispatch(ArchiveActions.archiveSummaries(kind));
    }, [kind, dispatch]);

    const summaryNodes = summaries.map(({dateInfo, titles}) => {
        const date = new Date(dateInfo.year, dateInfo.month);
        return (
            <div key={JSON.stringify(dateInfo)}>
                <p>{`${date.toDateString()} (${titles.length})`}</p>
            </div>
        )
    });

    return (
        <div className={classes.root}>
            <div className={classes.cards}>
                <HomeCards/>
            </div>
            <div className={classes.gutter}>
                {summaryNodes}
            </div>
            <div/>
        </div>
    );
}

export default Home;
