import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import HomeCards from "../home/HomeCards";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { ArchiveKind, ArchiveLike } from "../../common/Models";
import { ArchiveSearchOptions, ArchiveState } from "../../reducers/Archive";
import { RouterState } from "connected-react-router";
import { theme } from "../../styles/PersistentUi";

const useStyles = makeStyles(() => createStyles({
        root: {},
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
    searchOptions: ArchiveSearchOptions;
}

const selector = createSelector<StoreState, RouterState, ArchiveState, Props>(
    state => state.router,
    state => state.archives,
    (routerState, archiveState) => {
        const kind = routerState.location.pathname.split('/')[1] as ArchiveKind;
        return {
            kind,
            archives: archiveState.kindToArchivesMap[kind],
            searchOptions: archiveState.searchOptionsMap[kind],
        }
    }
);

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {kind}: Props = useSelector(selector, shallowEqual);

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
                appBarColor: theme.palette.primary.main,
                hasAppBarSpacer: true,
                menuItems: []
            }
        ));
    }, [kind, dispatch]);

    return (
        <div className={classes.root}>
            <div className={classes.cards}>
                <HomeCards/>
            </div>
            <div/>
        </div>
    );
}

export default Home;
