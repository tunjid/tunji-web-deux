import { applyMiddleware, combineReducers, createStore, PreloadedState, Reducer, Store } from 'redux';
import { StoreState } from '../types';
import { persistentUiReducer } from './PersistentUi';
import archiveReducer, { archiveStateSanitizer } from './Archive';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { homeReducer } from './Home';
import { authReducer } from './Auth';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory, History, LocationState } from 'history';
import { snackbarReducer } from './Snackbar';
import ReactGA from 'react-ga';
import clientConfig from '../config'

interface ConnectedStore {
    history: History
    store: Store<StoreState>
}

const reducers: (history: History) => Reducer<StoreState> = (history) => combineReducers<StoreState>({
    persistentUI: persistentUiReducer,
    home: homeReducer,
    auth: authReducer,
    archives: archiveReducer,
    snackbars: snackbarReducer,
    router: connectRouter<LocationState>(history),
});

export const clientStore: ConnectedStore = (function bar() {
    const hasDom = typeof window !== 'undefined';
    const history = hasDom ? createBrowserHistory() : createMemoryHistory();

    const analyticsId = clientConfig.googleAnalyticsId;
    if (analyticsId && hasDom) {
        ReactGA.initialize(analyticsId);
        history.listen(location => {
            ReactGA.set({page: location.pathname});
            ReactGA.pageview(location.pathname);
        });
    }

    // @ts-ignore
    const rawState: StoreState | undefined = hasDom ? window.__PRELOADED_STATE__ : undefined;
    // @ts-ignore
    if (hasDom) delete window.__PRELOADED_STATE__;

    const preloadedState = rawState ? {...rawState, archives: archiveStateSanitizer(rawState.archives)} : undefined;

    return {
        history,
        store: createStore<StoreState, any, any, any>(
            reducers(history),
            preloadedState as unknown as PreloadedState<StoreState>,
            composeWithDevTools(applyMiddleware(
                routerMiddleware(history),
                thunkMiddleware
            ))
        )
    };
}());

export const serverStore: (path: string) => ConnectedStore = (path) => {
    const history = createMemoryHistory();
    history.push(path);
    return {
        history,
        store: createStore<StoreState, any, any, any>(
            reducers(history),
            composeWithDevTools(applyMiddleware(
                routerMiddleware(history),
                thunkMiddleware
            ))
        )
    };
};
