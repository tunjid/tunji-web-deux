import { Theme, useMediaQuery, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { MoreVert } from "@material-ui/icons";
import * as React from 'react';
import { MenuRes } from "../../types/MenuRes";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { modifyAppBar } from "../../actions/PersistentUi";

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
    icon: {
        paddingLeft: '6px',
        paddingRight: '6px'
    },
    icons: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
}));

interface Props {
    items: MenuRes[];
    hasOverflow: boolean;
    anchorEl?: HTMLElement,
    onItemClick?: (item: MenuRes) => void;
}

const selector: OutputSelector<StoreState, Props, (res: PersistentUiState) => Props> = createSelector(
    state => state.persistentUI,
    persistentUI => ({
        items: persistentUI.menuItems,
        hasOverflow: persistentUI.menuItems.length > 0,
        anchorEl: persistentUI.anchorEl,
        onItemClick: persistentUI.menuClickListener,
    })
);

function useWidth(): string {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, '') || 'xs'
    );
}

const AppBarIcons = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        items,
        hasOverflow,
        onItemClick,
    }: Props = useSelector(selector, shallowEqual);

    const width = useWidth();
    const isSmallScreen = /xs|sm/.test(width);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        dispatch(modifyAppBar({anchorEl: event.currentTarget}))
    };

    const clickMenuItem = (clicked: MenuRes) => {
        if (onItemClick) onItemClick(clicked);
        else console.log('MENU CLICK LISTENER IS NULL')
    };

    const overflow = hasOverflow
        ? <IconButton aria-haspopup="true" onClick={handleMenuOpen} color="inherit"><MoreVert/></IconButton>
        : null;

    const renderIcon = (item: MenuRes) => isSmallScreen && item.icon
        ? <div key={item.text} className={classes.icon} onClick={() => clickMenuItem(item)}>{item.icon}</div>
        : <Button key={item.text} color="inherit" onClick={() => clickMenuItem(item)}>{item.text}</Button>;

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
