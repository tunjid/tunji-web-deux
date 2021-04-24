import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { theme } from "../../styles/PersistentUi";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { Tab, Tabs } from "@material-ui/core";
import { HomeState, HomeTab } from "../../reducers/Home";
import { HomeActions } from "../../actions/Home";

const throttle = require('lodash/throttle');

const useStyles = makeStyles(() => createStyles({
        root: {
            background: 'linear-gradient(to bottom, #083042, #083042)',
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

interface Props {
    appBarColor: string;
    hasAppBarShadow: boolean;
    tabsShow: boolean;
    selectedTab: HomeTab;
    tabs: HomeTab[];
}

const selector: OutputSelector<StoreState, Props, (a: PersistentUiState, b: HomeState) => Props> = createSelector(
    state => state.persistentUI,
    state => state.home,
    (persistentUI, home) => ({
        appBarColor: persistentUI.appBarColor,
        hasAppBarShadow: persistentUI.hasAppBarShadow,
        tabsShow: persistentUI.tabsShow,
        selectedTab: home.selectedTab,
        tabs: home.tabs,
    })
);


const HomeHeader = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        appBarColor,
        hasAppBarShadow,
        selectedTab,
        tabs,
    }: Props = useSelector(selector, shallowEqual);

    useEffect(() => {
        const onScroll = () => {
            const transparent = '#00000000'
            if (!appBarColor) return;

            const position = (window.pageYOffset !== undefined)
                ? window.pageYOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollTop;

            const currentlyAtTop = position < 100;
            const hasTopState = appBarColor === transparent || !hasAppBarShadow;

            if (hasTopState === currentlyAtTop) return;

            dispatch(PersistentUiActions.modifyAppBar({
                hasAppBarSpacer: false,
                hasAppBarShadow: !currentlyAtTop,
                appBarColor: currentlyAtTop ? transparent : theme.palette.secondary.main
            }));
        }

        const scrollListener = () => throttle(onScroll, 100)();

        window.addEventListener('scroll', scrollListener, true);

        return () => window.removeEventListener('scroll', scrollListener);
    });

    return (
        <div className={classes.root}>
            <Tabs
                className={classes.tabs}
                value={selectedTab.index}
                onChange={(_: any, index: number) => {
                    dispatch(HomeActions.selectTab(tabs[index]))
                }}
                indicatorColor="secondary"
                textColor="secondary"
                centered
            >
                {tabs.map((item: HomeTab) => <Tab className={classes.tab} key={item.kind} label={item.text}/>)}
            </Tabs>
        </div>
    );
}

export default HomeHeader;
