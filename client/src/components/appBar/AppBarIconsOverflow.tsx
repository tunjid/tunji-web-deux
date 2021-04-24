import { Menu } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import * as React from 'react';
import { MenuRes } from "../../types/MenuRes";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MENU_ROUTE, PersistentUiActions } from "../../actions/PersistentUi";
import { useHistory } from "react-router-dom";

interface Props {
    items: MenuRes[];
    anchorEl?: HTMLElement,
}

const selector: OutputSelector<StoreState, Props, (res: PersistentUiState) => Props> = createSelector(
    state => state.persistentUI,
    persistentUI => ({
        items: persistentUI.menuItems,
        anchorEl: persistentUI.anchorEl,
    })
);

const AppBarIconsOverflow = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        items,
        anchorEl,
    }: Props = useSelector(selector, shallowEqual);

    const closeMenu = () => {
        PersistentUiActions.modifyAppBar({anchorEl: undefined})
    }

    const onMenuItemClicked = (item: MenuRes) => {
        if (item.action.type === MENU_ROUTE) history.push(item.action.route);
        else dispatch(item.action);

        dispatch(closeMenu());
    };

    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={() => dispatch(closeMenu())}>
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
