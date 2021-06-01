import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import HomeHeader from './HomeHeader';
import ArchiveCards from '../cards/ArchiveCards';
import { PersistentUiActions } from '../../actions/PersistentUi';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch } from 'react-redux';
import { HomeState } from '../../reducers/Home';
import { createSelector } from 'reselect';
import { StoreState } from '../../types';
import { PersistentUiState } from '../../reducers/PersistentUi';
import { AuthState } from '../../reducers/Auth';
import Fab from '@material-ui/core/Fab';
import { Helmet } from 'react-helmet';
import { ArchiveKind } from '@tunji-web/common';
import { Link } from 'react-router-dom';
import { ArchiveActions, ArchivesQuery } from '../../actions/Archive';
import { archivesSelector } from '../common/Common';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import { getSearch } from 'connected-react-router';
import { Search } from 'history';

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
            width: `80%`,
            maxWidth: '1080px',
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

const querySelector = createSelector<StoreState, Search, Record<ArchiveKind, ArchivesQuery>>(
    getSearch,
    (search) => ({
        [ArchiveKind.Articles]: {
            params: new URLSearchParams(search),
            key: `Home-${ArchiveKind.Articles}`,
            kind: ArchiveKind.Articles,
        },
        [ArchiveKind.Projects]: {
            params: new URLSearchParams(search),
            key: `Home-${ArchiveKind.Projects}`,
            kind: ArchiveKind.Projects,
        },
        [ArchiveKind.Talks]: {
            params: new URLSearchParams(search),
            key: `Home-${ArchiveKind.Talks}`,
            kind: ArchiveKind.Talks,
        }
    })
);

const SayHiIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#FFFFFF"
                  d="M11 14H9C9 9.03 13.03 5 18 5V7C14.13 7 11 10.13 11 14M18 11V9C15.24 9 13 11.24 13 14H15C15 12.34 16.34 11 18 11M7 4C7 2.89 6.11 2 5 2S3 2.89 3 4 3.89 6 5 6 7 5.11 7 4M11.45 4.5H9.45C9.21 5.92 8 7 6.5 7H3.5C2.67 7 2 7.67 2 8.5V11H8V8.74C9.86 8.15 11.25 6.5 11.45 4.5M19 17C20.11 17 21 16.11 21 15S20.11 13 19 13 17 13.89 17 15 17.89 17 19 17M20.5 18H17.5C16 18 14.79 16.92 14.55 15.5H12.55C12.75 17.5 14.14 19.15 16 19.74V22H22V19.5C22 18.67 21.33 18 20.5 18Z"/>
        </svg>
    );
};

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const {
        appBarTitle,
        selectedTab,
        isSignedIn,
    } = useDeepEqualSelector(selector);
    const queries = useDeepEqualSelector(querySelector);
    const articles = useDeepEqualSelector(archivesSelector(() => queries[ArchiveKind.Articles], 13));
    const projects = useDeepEqualSelector(archivesSelector(() => queries[ArchiveKind.Projects], 13));
    const talks = useDeepEqualSelector(archivesSelector(() => queries[ArchiveKind.Talks], 13));

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            appBarTitle: 'Tunji\'s corner of the web',
            hasAppBarSpacer: false,
            hasHomeIcon: false,
            menuItems: [{
                id: 'about',
                text: 'About',
                icon: <SayHiIcon/>,
                action: PersistentUiActions.menuRoute('/about'),
            }],
            fab: isSignedIn ? {
                id: 'create',
                text: 'Create',
                icon: <AddIcon/>,
                action: PersistentUiActions.menuRoute(`/${selectedTab}/create`)
            } : undefined
        }));
    }, [appBarTitle, isSignedIn, selectedTab, dispatch]);

    useEffect(() => {
        dispatch(ArchiveActions.fetchArchives(queries[ArchiveKind.Articles]));
        dispatch(ArchiveActions.fetchArchives(queries[ArchiveKind.Projects]));
        dispatch(ArchiveActions.fetchArchives(queries[ArchiveKind.Talks]));
    }, [queries, dispatch]);

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
                <div hidden={selectedTab !== ArchiveKind.Articles}>
                    <ArchiveCards kind={ArchiveKind.Articles} archives={articles}/>
                </div>
                <div hidden={selectedTab !== ArchiveKind.Projects}>
                    <ArchiveCards kind={ArchiveKind.Projects} archives={projects}/>
                </div>
                <div hidden={selectedTab !== ArchiveKind.Talks}>
                    <ArchiveCards kind={ArchiveKind.Talks} archives={talks}/>
                </div>
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
};

export default Home;
