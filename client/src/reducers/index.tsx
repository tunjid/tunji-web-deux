import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import { StoreState } from "../types";
import { persistentUiReducer } from "./PersistentUi";
import archiveReducerFor, { ArchiveKind } from "./Archive";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";

const reducers: Reducer<StoreState> = combineReducers<StoreState>({
    persistentUI: persistentUiReducer,
    articles: archiveReducerFor(ArchiveKind.Articles),
    projects: archiveReducerFor(ArchiveKind.Projects),
    talks: archiveReducerFor(ArchiveKind.Talks),
});

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

export const store = createStore<StoreState, any, any, any>(reducers, composedEnhancer);
