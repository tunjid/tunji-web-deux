import { Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import * as React from "react";
import AppBarIcons from "../../components/appBar/AppBarIcons";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { createSelector } from 'reselect'
import { UserLike } from '@tunji-web/common';
import HomeIcon from "@material-ui/icons/Home";
import { horizontalMargin, StylelessAnchor } from "../../styles/Common";
import { Link } from "react-router-dom";
import { useDeepEqualSelector } from "../../hooks/UseDeepEqualSelector";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {},
    grow: {
        flexGrow: 1,
    },
    menuSection: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarColorShift: {
        '-webkit-transition': 'background-color .8s',
        transition: 'background-color .8s'
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    homeIcon: {
        ...StylelessAnchor,
        ...horizontalMargin(theme.spacing(2)),
    }
}));

interface State {
    appBarTitle: string;
    appBarColor: string;
    hasAppBarShadow: boolean;
    hasHomeIcon: boolean;
    signedInUser?: UserLike
}

const selector = createSelector<StoreState, PersistentUiState, State>(
    state => state.persistentUI,
    persistentUI => ({
        appBarTitle: persistentUI.appBarTitle,
        appBarColor: persistentUI.appBarColor,
        hasHomeIcon: persistentUI.hasHomeIcon,
        hasAppBarShadow: persistentUI.hasAppBarShadow,
    })
);

const MainAppBar = () => {
    const classes = useStyles();
    const {
        appBarTitle,
        appBarColor,
        hasHomeIcon,
        hasAppBarShadow,
    }: State = useDeepEqualSelector(selector);

    const appBarStyle = {backgroundColor: appBarColor, boxShadow: hasAppBarShadow ? undefined : 'none'};
    const backToHome = hasHomeIcon ? <Link className={classes.homeIcon} to={'/'}><HomeIcon/></Link> : undefined;

    return (
        <AppBar
            position='fixed'
            className={classNames(classes.appBar, classes.appBarColorShift)}
            style={appBarStyle}>
            <Toolbar disableGutters={true} className={classes.toolbar}>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    className={classNames(
                        classes.menuButton
                    )}>
                </IconButton>
                {backToHome}
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.title}>
                    {appBarTitle}
                </Typography>
                <div className={classes.grow}/>
                <div className={classes.menuSection}>
                    <AppBarIcons/>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default MainAppBar
