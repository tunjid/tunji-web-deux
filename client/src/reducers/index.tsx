import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import { StoreState } from "../types";
import { persistentUiReducer } from "./PersistentUi";
import archiveReducer from "./Archive";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";
import { homeReducer } from "./Home";
import { authReducer } from "./Auth";
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory, History, LocationState } from 'history'
import { snackbarReducer } from "./Snackbar";

const reducers: (history: History) => Reducer<StoreState> = (history) => combineReducers<StoreState>({
    persistentUI: persistentUiReducer,
    home: homeReducer,
    auth: authReducer,
    archives: archiveReducer,
    snackbars: snackbarReducer,
    router: connectRouter<LocationState>(history),
});


export const history = createBrowserHistory();

export const store = createStore<StoreState, any, any, any>(
    reducers(history),
    composeWithDevTools(applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware
    ))
);
