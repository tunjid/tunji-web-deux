import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import HomeHeader from "./HomeHeader";
import ArchiveCards from "../cards/ArchiveCards";
import { PersistentUiActions } from "../../actions/PersistentUi";
import AddIcon from "@material-ui/icons/Add";
import PhoneIcon from "@material-ui/icons/Phone";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { HomeState } from "../../reducers/Home";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { AuthState } from "../../reducers/Auth";
import Fab from "@material-ui/core/Fab";
import { RouterActions } from "../../actions/Router";
import { Helmet } from "react-helmet";
import { ArchiveKind } from "../../client-server-common/Models";
import { Link } from 'react-router-dom'
import { ArchiveActions, ArchivesQuery } from "../../actions/Archive";
import { archivesSelector } from "../common/Common";

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        header: {
            width: '100vw',
        },
        cards: {
            position: 'relative',
            top: '-10vh',
            'z-index': '1000',
        },
        topFab: {
            position: 'relative',
            top: '-10vh',
            margin: theme.spacing(1),
        },
        topFabHyperlink: {
            color: '#000000',
            'text-decoration': 'none',
        },
        bottomFab: {
            margin: theme.spacing(1),
        },
        bottomFabHyperlink: {
            color: '#FFFFFF',
            'text-decoration': 'none',
        },
    }
));

interface State {
    appBarTitle: string;
    isSignedIn: boolean;
    selectedTab: ArchiveKind;
}

const selector = createSelector<StoreState, PersistentUiState, HomeState, AuthState, State>(
    state => state.persistentUI,
    state => state.home,
    state => state.auth,
    (persistentUI, home, auth) => ({
        appBarTitle: persistentUI.appBarTitle,
        selectedTab: home.selectedTab,
        isSignedIn: !!auth.signedInUser,
    })
);

const querySelector = createSelector<StoreState, HomeState, ArchivesQuery>(
    state => state.home,
    (home) => ({
        params: {},
        key: `Home-${home.selectedTab}`,
        kind: home.selectedTab,
    })
);

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const {
        appBarTitle,
        selectedTab,
        isSignedIn,
    } = useSelector(selector, shallowEqual);
    const query = useSelector(querySelector, shallowEqual);
    const archives = useSelector(archivesSelector(querySelector, 13), shallowEqual);

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            appBarTitle: 'Tunji\'s corner of the web',
            hasAppBarSpacer: false,
            hasHomeIcon: false,
            menuItems: [{
                id: 'about',
                text: 'About',
                icon: <PhoneIcon/>,
                action: RouterActions.push('/about'),
            }],
            fab: isSignedIn ? {
                id: 'create',
                text: 'Create',
                icon: <AddIcon/>,
                action: PersistentUiActions.menuRoute(`/${selectedTab}/create`)
            } : undefined
        }));
    }, [appBarTitle, isSignedIn, selectedTab, dispatch])

    useEffect(() => {
        dispatch(ArchiveActions.fetchArchives(query));
    }, [query, dispatch]);

    return (
        <div className={classes.root}>
            <Helmet>
                <title>Adetunji Dahunsi</title>
                <meta name="description" content="Tunji's web corner"/>
            </Helmet>
            <HomeHeader/>
            <Fab
                className={classes.topFab}
                variant="extended"
                color="secondary"
                size="small"
                aria-label="add"
            >
                <Link className={classes.topFabHyperlink} to={`/${selectedTab}`}>{`All ${selectedTab}`}</Link>
            </Fab>
            <div className={classes.cards}>
                <ArchiveCards kind={selectedTab} archives={archives}/>
            </div>
            <Fab
                className={classes.bottomFab}
                variant="extended"
                color="primary"
                size="small"
                aria-label="add"
            >
                <Link className={classes.bottomFabHyperlink} to={`/${selectedTab}`}>{`All ${selectedTab}`}</Link>
            </Fab>
        </div>
    );
}

export default Home;
