import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import './App.css';
import Routes from './routes';
import { StoreState } from './types';
import { createSelector, OutputSelector } from 'reselect';
import { UserLike } from '@tunji-web/common';

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
}

interface State {
    signedInUser?: UserLike;
    hasAppBarSpacer: boolean;
}

const selector: OutputSelector<StoreState, State, (a: boolean, b?: UserLike) => State> = createSelector(
    state => state.persistentUI.hasAppBarSpacer,
    state => state.auth.signedInUser,
    (hasAppBarSpacer, signedInUser) => ({
        signedInUser,
        hasAppBarSpacer,
    })
);

const App = ({}: Props) => {
    return (
        <Routes/>
    );
};

export default App;
