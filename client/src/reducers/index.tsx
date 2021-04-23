import { combineReducers, createStore, Reducer } from "redux";
import { StoreState } from "../types";
import { persistentUiReducer } from "./PersistentUi";
import archiveReducerFor, { ArchiveKind } from "./Archive";

const reducers: Reducer<StoreState> = combineReducers<StoreState>({
    persistentUI: persistentUiReducer,
    articles: archiveReducerFor(ArchiveKind.Article),
    projects: archiveReducerFor(ArchiveKind.Project),
    talks: archiveReducerFor(ArchiveKind.Talk),
});

/* eslint-disable no-underscore-dangle */
// @ts-ignore
export const store = createStore<StoreState, any, any, any>(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
/* eslint-enable */
