import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";
import * as React from 'react';
import { shallowEqual, useSelector } from "react-redux";
import './App.css';
import MainAppBar from "./components/appBar/MainAppBar";
import AppBarIconsOverflow from "./components/appBar/AppBarIconsOverflow";
import Routes from './routes'
import { theme } from "./styles/PersistentUi";
import { StoreState } from "./types";
import { createSelector, OutputSelector } from "reselect";
import { PersistentUiState } from "./reducers/PersistentUi";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        overflow: 'auto',
    },
    routes: {
        position: 'relative',
        'z-index': '100000',
        top: '-100px',
    }
}));

interface Props {
    hasAppBarSpacer: boolean;
}

const selector: OutputSelector<StoreState, Props, (res: PersistentUiState) => Props> = createSelector(
    state => state.persistentUI,
    persistentUI => ({
        hasAppBarSpacer: persistentUI.hasAppBarSpacer,
    })
);

const App = () => {

    const classes = useStyles();
    const {hasAppBarSpacer}: Props = useSelector(selector, shallowEqual);
    const [appTheme] = useState(theme);

    const appBarSpacer = hasAppBarSpacer ? <div className={classes.appBarSpacer}/> : null;

    return (
        <div className={classes.root}>
            <ThemeProvider theme={appTheme}>
                <CssBaseline/>
                <MainAppBar/>
                <AppBarIconsOverflow/>
                <main className={classes.content}>
                    {appBarSpacer}
                    <Routes/>
                </main>
            </ThemeProvider>
        </div>
    );
}

export default App;
