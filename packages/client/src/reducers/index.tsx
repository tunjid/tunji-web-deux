import { applyMiddleware, combineReducers, Reducer, Store, legacy_createStore as createStore } from 'redux';
import { StoreState } from '../types';
import { persistentUiReducer } from './PersistentUi';
import archiveReducer, { archiveStateSanitizer } from './Archive';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { homeReducer } from './Home';
import { authReducer } from './Auth';
import { snackbarReducer } from './Snackbar';
import { openGraphReducer } from '@tunji-web/client/src/reducers/OpenGraph';
import { detailReducer } from '@tunji-web/client/src/reducers/Detail';

interface ConnectedStore {
    store: Store<StoreState>;
}

const reducers: () => Reducer<StoreState> = () => combineReducers({
    persistentUI: persistentUiReducer,
    home: homeReducer,
    auth: authReducer,
    detail: detailReducer,
    archives: archiveReducer,
    openGraph: openGraphReducer,
    snackbars: snackbarReducer,
} as any);

export const clientStore: ConnectedStore = (function bar() {
    const hasDom = typeof window !== 'undefined';

    // @ts-ignore
    const rawState: StoreState | undefined = hasDom ? window.__PRELOADED_STATE__ : undefined;
    // @ts-ignore
    if (hasDom) delete window.__PRELOADED_STATE__;

    const preloadedState = rawState ? {...rawState, archives: archiveStateSanitizer(rawState.archives)} : undefined;

    return {
        store: createStore(
            reducers(),
            preloadedState as any,
            composeWithDevTools(applyMiddleware(
                thunk
            ))
        )
    };
}());

export const serverStore: (path: string) => ConnectedStore = (path) => {
    return {
        store: createStore(
            reducers(),
            composeWithDevTools(applyMiddleware(
                thunk
            ))
        )
    };
};
