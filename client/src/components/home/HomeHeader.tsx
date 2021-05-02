import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { theme } from "../../styles/PersistentUi";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { Tab, Tabs } from "@material-ui/core";
import { HomeState } from "../../reducers/Home";
import { HomeActions } from "../../actions/Home";
import useEventListener from "../../hooks/UseEventListener";
import { AuthState } from "../../reducers/Auth";
import { ArchiveKind } from "../../common/Models";

const throttle = require('lodash/throttle');

const useStyles = makeStyles(() => createStyles({
        root: {
            background: 'linear-gradient(to bottom, #083042, #083042)',
            width: '100vw',
            minHeight: '50vh',
        },
        tabs: {
            position: 'relative',
            top: '30vh',
            textColorSecondary: '#FFFFFF',
        },
        tab: {
            color: "#FFFFFF"
        },
    }
));

interface State {
    appBarColor: string;
    hasAppBarShadow: boolean;
    onHomePage: boolean;
    isSignedIn: boolean;
    selectedTab: ArchiveKind;
    tabs: ArchiveKind[];
}

const selector = createSelector<StoreState, PersistentUiState, HomeState, AuthState, boolean, State>(
    state => state.persistentUI,
    state => state.home,
    state => state.auth,
    state => !!state.router.location.pathname,
    (persistentUI, home, auth, onHomePage) => ({
        appBarColor: persistentUI.appBarColor,
        hasAppBarShadow: persistentUI.hasAppBarShadow,
        selectedTab: home.selectedTab,
        tabs: home.tabs,
        isSignedIn: !!auth.signedInUser,
        onHomePage,
    })
);


const HomeHeader = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        appBarColor,
        hasAppBarShadow,
        selectedTab,
        onHomePage,
        tabs,
    }: State = useSelector(selector, shallowEqual);

    const onScroll = () => {
        const transparent = '#00000000'
        if (!appBarColor || !onHomePage) return;

        const position = (window.pageYOffset !== undefined)
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        const currentlyAtTop = position < 100;
        const hasTopState = appBarColor === transparent || !hasAppBarShadow;

        if (hasTopState === currentlyAtTop) return;

        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: !currentlyAtTop,
            appBarColor: currentlyAtTop ? transparent : theme.palette.secondary.main,
        }));
    }

    const scrollListener = () => throttle(onScroll, 100)();

    useEventListener('scroll', scrollListener);

    return (
        <div className={classes.root}>
            <Tabs
                className={classes.tabs}
                value={tabs.indexOf(selectedTab)}
                onChange={(_: any, index: number) => {
                    dispatch(HomeActions.selectTab(tabs[index]))
                }}
                indicatorColor="secondary"
                textColor="secondary"
                centered
            >
                {tabs.map((item: ArchiveKind) => <Tab className={classes.tab} key={item} label={item}/>)}
            </Tabs>
        </div>
    );
}

export default HomeHeader;
