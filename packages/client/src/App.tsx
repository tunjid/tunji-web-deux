import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import './App.css';
import MainAppBar from "./components/appBar/MainAppBar";
import AppBarIconsOverflow from "./components/appBar/AppBarIconsOverflow";
import Routes from './routes'
import { theme } from "./styles/PersistentUi";
import { StoreState } from "./types";
import { createSelector, OutputSelector } from "reselect";
import { UserLike } from '@tunji-web/common';
import { AuthActions } from "./actions/Auth";
import { ConnectedRouter } from 'connected-react-router'
import { history } from "./reducers";
import { SnackbarProvider } from "notistack";
import SnackbarManager from "./containers/SnackbarManager";
import MainFab from "./components/appBar/MainFab";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
    },
    routes: {
        position: 'relative',
        top: '-100px',
    }
}));

interface Props {
    signedInUser?: UserLike;
    hasAppBarSpacer: boolean;
}

const selector: OutputSelector<StoreState, Props, (a: boolean, b?: UserLike) => Props> = createSelector(
    state => state.persistentUI.hasAppBarSpacer,
    state => state.auth.signedInUser,
    (hasAppBarSpacer, signedInUser) => ({
        signedInUser,
        hasAppBarSpacer,
    })
);

const App = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [appTheme] = useState(theme);
    const {hasAppBarSpacer, signedInUser}: Props = useSelector(selector, shallowEqual);

    useEffect(() => {
        dispatch(AuthActions.fetchSession());
    }, [dispatch, signedInUser?.firstName]);

    const appBarSpacer = hasAppBarSpacer ? <div className={classes.appBarSpacer}/> : null;

    return (
        <div className={classes.root}>
            <ThemeProvider theme={appTheme}>
                <SnackbarProvider maxSnack={3}>
                <ConnectedRouter history={history}>
                    <CssBaseline/>
                    <SnackbarManager />
                    <MainAppBar/>
                    <AppBarIconsOverflow/>
                    <main className={classes.content}>
                        {appBarSpacer}
                        <Routes/>
                    </main>
                    <MainFab/>
                </ConnectedRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </div>
    );
}

export default App;
