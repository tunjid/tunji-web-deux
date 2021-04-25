import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import { StoreState } from "../types";
import { persistentUiReducer } from "./PersistentUi";
import archiveReducerFor from "./Archive";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";
import { homeReducer } from "./Home";
import { authReducer } from "./Auth";
import { ArchiveKind } from "../common/Models";
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory, History, LocationState } from 'history'

const reducers: (history: History) => Reducer<StoreState> = (history) => combineReducers<StoreState>({
    persistentUI: persistentUiReducer,
    articles: archiveReducerFor(ArchiveKind.Articles),
    projects: archiveReducerFor(ArchiveKind.Projects),
    talks: archiveReducerFor(ArchiveKind.Talks),
    home: homeReducer,
    auth: authReducer,
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
