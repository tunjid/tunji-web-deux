import { Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { MoreVert } from "@material-ui/icons";
import * as React from 'react';
import { MenuRes } from "../../types/MenuRes";
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { useDispatch } from "react-redux";
import { MENU_ROUTE, PersistentUiActions } from "../../actions/PersistentUi";
import { RouterActions } from "../../actions/Router";
import { useWidth } from "../../hooks/UseWidth";
import { useDeepEqualSelector } from "../../hooks/UseDeepEqualSelector";
import { Link } from "react-router-dom";
import { StylelessAnchor } from "../../styles/Common";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%',
    },
    header: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    iconContainer: {
        paddingLeft: '6px',
        paddingRight: '6px',
        ...StylelessAnchor,
    },
    icons: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
}));

interface State {
    items: MenuRes[];
    hasOverflow: boolean;
    anchorEl?: HTMLElement,
}

const selector = createSelector<StoreState, PersistentUiState, State>(
    state => state.persistentUI,
    persistentUI => ({
        items: persistentUI.menuItems,
        hasOverflow: persistentUI.menuItems.length > 2,
        anchorEl: persistentUI.anchorEl,
    })
);

const AppBarIcons = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        items,
        hasOverflow,
    }: State = useDeepEqualSelector(selector);

    const width = useWidth();
    const isSmallScreen = /xs|sm/.test(width);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        dispatch(PersistentUiActions.modifyAppBar({anchorEl: event.currentTarget}))
    };

    const clickMenuItem = (clicked: MenuRes) => {
        if (clicked.action.type === MENU_ROUTE) dispatch(RouterActions.push(clicked.action.route));
        else dispatch(clicked.action);
    };

    const overflow = hasOverflow
        ? <IconButton aria-haspopup="true" onClick={handleMenuOpen} color="inherit"><MoreVert/></IconButton>
        : null;

    const renderIcon = (item: MenuRes) =>
        item.action.type === MENU_ROUTE
            ? <Link key={item.text}
                    className={classes.iconContainer}
                    to={item.action.route}>
                {isSmallScreen && item.icon ? item.icon : item.text}
            </Link>
            : <div key={item.text}
                   className={classes.iconContainer}
                   onClick={() => clickMenuItem(item)}>
                {isSmallScreen && item.icon ? item.icon : item.text}
            </div>;

    const menuItems = items.map(renderIcon);

    return (
        <div className={classes.root}>
            <div className={classes.icons}>
                {menuItems}
                {overflow}
            </div>
        </div>
    );
}

export default AppBarIcons;
