import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { theme } from "../../styles/PersistentUi";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { AppTab, PersistentUiState } from "../../reducers/PersistentUi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { modifyAppBar } from "../../actions/PersistentUi";
import { Tab, Tabs } from "@material-ui/core";

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
    selectedTab: AppTab;
    tabs: AppTab[];
}

const selector: OutputSelector<StoreState, Props, (res: PersistentUiState) => Props> = createSelector(
    state => state.persistentUI,
    persistentUI => ({
        appBarColor: persistentUI.appBarColor,
        hasAppBarShadow: persistentUI.hasAppBarShadow,
        tabsShow: persistentUI.tabsShow,
        selectedTab: persistentUI.selectedTab,
        tabs: persistentUI.tabs,
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

            dispatch(modifyAppBar({
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
                    dispatch(modifyAppBar({selectedTab: tabs[index]}))
                }}
                indicatorColor="secondary"
                textColor="secondary"
                centered
            >
                {tabs.map((item: AppTab) => <Tab className={classes.tab} label={item.text}/>)}
            </Tabs>
        </div>
    );
}

export default HomeHeader;
