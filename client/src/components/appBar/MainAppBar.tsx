import { Avatar, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AppBarIcons from "../../components/appBar/AppBarIcons";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { createSelector } from 'reselect'
import { UserLike } from "../../common/Models";
import { RouterActions } from "../../actions/Router";

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
    avatar: {
        'margin-left': theme.spacing(2),
        'margin-right': theme.spacing(2),
    }
}));

interface Props {
    appBarTitle: string;
    appBarColor: string;
    hasAppBarShadow: boolean;
    signedInUser?: UserLike
}

const selector = createSelector<StoreState, PersistentUiState, Props>(
    state => state.persistentUI,
    persistentUI => ({
        appBarTitle: persistentUI.appBarTitle,
        appBarColor: persistentUI.appBarColor,
        hasAppBarShadow: persistentUI.hasAppBarShadow,
    })
);

const MainAppBar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        appBarTitle,
        appBarColor,
        hasAppBarShadow,
    }: Props = useSelector(selector, shallowEqual);

    const appBarStyle = {backgroundColor: appBarColor, boxShadow: hasAppBarShadow ? undefined : 'none'};

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
                <Avatar
                    onClick={() => dispatch(RouterActions.push('/'))}
                    className={classes.avatar}
                    src={'https://pbs.twimg.com/profile_images/1368773620386922502/XN6-njLn_400x400.jpg'}
                />
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
