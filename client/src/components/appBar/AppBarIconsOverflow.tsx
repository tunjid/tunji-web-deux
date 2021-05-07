import { Menu } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import * as React from 'react';
import { MenuRes } from "../../types/MenuRes";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { useDispatch, useSelector } from "react-redux";
import { MENU_ROUTE, PersistentUiActions } from "../../actions/PersistentUi";
import { RouterActions } from "../../actions/Router";
import _ from 'lodash';

interface State {
    items: MenuRes[];
    anchorEl?: HTMLElement,
}

const selector: OutputSelector<StoreState, State, (res: PersistentUiState) => State> = createSelector(
    state => state.persistentUI,
    persistentUI => ({
        items: persistentUI.menuItems.splice(2, persistentUI.menuItems.length),
        anchorEl: persistentUI.anchorEl,
    })
);

const AppBarIconsOverflow = () => {
    const dispatch = useDispatch();
    const {
        items,
        anchorEl,
    }: State = useSelector(selector, (left, right) => {
        const itemsEqual = _.isEqual(left.items.map(item => item.id), right.items.map(item => item.id));
        const anchorsEqual = left.anchorEl === right.anchorEl;
        return itemsEqual && anchorsEqual;
    });

    const onMenuItemClicked = (item: MenuRes) => {
        if (item.action.type === MENU_ROUTE) dispatch(RouterActions.push(item.action.route));
        else dispatch(item.action);

        dispatch(PersistentUiActions.modifyAppBar({anchorEl: undefined}));
    };

    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={() => dispatch(PersistentUiActions.modifyAppBar({anchorEl: undefined}))}>
            {items.map(item => (
                <MenuItem key={item.id} onClick={() => onMenuItemClicked(item)}>{item.text}</MenuItem>))}
        </Menu>
    );

    return (
        <div>
            {renderMenu}
        </div>
    );
}

export default AppBarIconsOverflow;
