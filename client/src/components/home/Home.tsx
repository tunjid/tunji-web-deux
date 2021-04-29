import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import HomeHeader from "./HomeHeader";
import ArchiveCards from "../cards/ArchiveCards";
import { PersistentUiActions } from "../../actions/PersistentUi";
import AddIcon from "@material-ui/icons/Add";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { HomeState, HomeTab } from "../../reducers/Home";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { AuthState } from "../../reducers/Auth";
import Fab from "@material-ui/core/Fab";

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

interface Props {
    appBarTitle: string;
    isSignedIn: boolean;
    selectedTab: HomeTab;
}

const selector = createSelector<StoreState, PersistentUiState, HomeState, AuthState, Props>(
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
    }: Props = useSelector(selector, shallowEqual);


    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            appBarTitle: 'Home',
            hasAppBarSpacer: false,
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
                <ArchiveCards/>
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
