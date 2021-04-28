import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import HomeHeader from "./HomeHeader";
import HomeCards from "./HomeCards";
import { PersistentUiActions } from "../../actions/PersistentUi";
import AddIcon from "@material-ui/icons/Add";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { HomeState, HomeTab } from "../../reducers/Home";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { AuthState } from "../../reducers/Auth";

const useStyles = makeStyles(() => createStyles({
        root: {},
        cards: {
            position: 'relative',
            top: '-10vh',
            'z-index': '1000',
        },
    }
));

interface Props {
    appBarTitle: string;
    isSignedIn: boolean;
    selectedTab: HomeTab;
}

const selector = createSelector<StoreState, PersistentUiState, HomeState, AuthState, boolean, Props>(
    state => state.persistentUI,
    state => state.home,
    state => state.auth,
    state => !!state.router.location.pathname,
    (persistentUI, home, auth, onHomePage) => ({
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
            <div className={classes.cards}>
                <HomeCards/>
            </div>
        </div>
    );
}

export default Home;
