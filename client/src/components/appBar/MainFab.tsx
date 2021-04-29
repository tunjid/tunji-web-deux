import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { MenuRes } from "../../types/MenuRes";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MENU_ROUTE } from "../../actions/PersistentUi";
import { RouterActions } from "../../actions/Router";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
            'z-index': 100000,
        },
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
    }),
);

interface State {
    menu?: MenuRes
}

const selector = createSelector<StoreState, PersistentUiState, State>(
    state => state.persistentUI,
    persistentUI => ({
        menu: persistentUI.fab
    })
);

export default function MainFab() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {menu} = useSelector(selector, shallowEqual);

    const onMenuClicked = (clicked?: MenuRes) => {
        if (!clicked) return;
        else if (clicked.action.type === MENU_ROUTE) dispatch(RouterActions.push(clicked.action.route));
        else dispatch(clicked.action);
    };

    const icon = menu?.icon ? menu?.icon : <div/>;

    const element = menu
        ? <div className={classes.root}>
            <Fab
                variant="extended"
                color="primary"
                aria-label="add"
                className={classes.margin}
                onClick={() => onMenuClicked(menu)}
            >
                <div className={classes.extendedIcon}/>
                {icon}
                <div className={classes.extendedIcon}/>
                {menu?.text || ''}
            </Fab>
        </div>
        : <div/>

    return (element);
}
