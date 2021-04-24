import { Menu } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import * as React from 'react';
import { MenuRes } from "../../types/MenuRes";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";

interface Props {
    items: MenuRes[];
    anchorEl?: HTMLElement,
    onItemClick?: (item: MenuRes) => void;
}

const selector: OutputSelector<StoreState, Props, (res: PersistentUiState) => Props> = createSelector(
    state => state.persistentUI,
    persistentUI => ({
        items: persistentUI.menuItems,
        anchorEl: persistentUI.anchorEl,
        onItemClick: persistentUI.menuClickListener,
    })
);

const AppBarIconsOverflow = () => {
    const dispatch = useDispatch();
    const {
        items,
        anchorEl,
        onItemClick,
    }: Props = useSelector(selector, shallowEqual);

    const closeMenu = () => {
        PersistentUiActions.modifyAppBar({anchorEl: undefined})
    }

    const onMenuItemClicked = (item: MenuRes) => {
        onItemClick?.(item);
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
