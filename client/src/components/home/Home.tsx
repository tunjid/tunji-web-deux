import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import HomeHeader from "./HomeHeader";
import ArchiveCards from "../cards/ArchiveCards";
import { PersistentUiActions } from "../../actions/PersistentUi";
import AddIcon from "@material-ui/icons/Add";
import PhoneIcon from "@material-ui/icons/Phone";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { HomeState, HomeTab } from "../../reducers/Home";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { AuthState } from "../../reducers/Auth";
import Fab from "@material-ui/core/Fab";
import { RouterActions } from "../../actions/Router";
import {Helmet} from "react-helmet";

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
    selectedTab: HomeTab;
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

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const {
        appBarTitle,
        selectedTab,
        isSignedIn,
    }: State = useSelector(selector, shallowEqual);


    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            appBarTitle: 'Tunji\'s web corner',
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
                action: PersistentUiActions.menuRoute(`/${selectedTab.kind}/create`)
            } : undefined
        }));
    }, [appBarTitle, isSignedIn, selectedTab.kind, dispatch])

    return (
        <div className={classes.root}>
            <Helmet>
                <title>Adetunji Dahunsi</title>
                <meta name="description" content="Tunji's web corner" />
            </Helmet>
            <HomeHeader/>
            <Fab
                className={classes.topFab}
                variant="extended"
                color="secondary"
                size="small"
                aria-label="add"
            >
                <a className={classes.topFabHyperlink} href={selectedTab.kind}>{`All ${selectedTab.kind}`}</a>
            </Fab>
            <div className={classes.cards}>
                <ArchiveCards kind={selectedTab.kind}/>
            </div>
            <Fab
                className={classes.bottomFab}
                variant="extended"
                color="primary"
                size="small"
                aria-label="add"
            >
                <a className={classes.bottomFabHyperlink} href={selectedTab.kind}>{`All ${selectedTab.kind}`}</a>
            </Fab>
        </div>
    );
}

export default Home;
