import {createSelector} from 'reselect';
import {StoreState} from '../types';
import {MenuRes} from "../types/MenuRes";

export const getPersistentUI = (state: StoreState) => state.persistentUI;

export const doTabsShow: (state: StoreState) => boolean = createSelector(getPersistentUI, (persistentUI) => persistentUI.tabsShow);

export const getAppBarTitle: (state: StoreState) => string = createSelector(getPersistentUI, (persistentUI) => persistentUI.appBarTitle);

export const getAppBarMenu: (state: StoreState) => MenuRes[] = createSelector(getPersistentUI, (persistentUI) => persistentUI.menuItems.slice(0, 2));

export const getAppBarMenuOverflow: (state: StoreState) => MenuRes[] = createSelector(getPersistentUI, (persistentUI) => persistentUI.menuItems.slice(2, persistentUI.menuItems.length));

export const hasAppBarMenuOverflow: (state: StoreState) => boolean = createSelector(getAppBarMenuOverflow, (items) => items.length > 0);

export const hasAppBarSpacer: (state: StoreState) => boolean = createSelector(getPersistentUI, (persistentUI) => persistentUI.hasAppBarSpacer);

export const getAppBarMenuAnchor: (state: StoreState) => HTMLElement | undefined = createSelector(getPersistentUI, (persistentUI) => persistentUI.anchorEl);

export const getAppBarMenuClickListener: (state: StoreState) => ((clicked: MenuRes) => void) | undefined = createSelector(getPersistentUI, (persistentUI) => persistentUI.menuClickListener);

