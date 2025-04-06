import * as React from 'react';
import './App.css';
import Routes from './routes';
import { StoreState } from './types';
import { createSelector, OutputSelector } from 'reselect';
import { UserLike } from '@tunji-web/common';


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
