import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { createSelector } from "reselect";
import { StoreState } from "../types";
import { SnackbarActions, SnackbarNotification } from "../actions/Snackbar";
import { SnackbarState } from "../reducers/Snackbar";
import { useDeepEqualSelector } from "../hooks/UseDeepEqualSelector";

const selector = createSelector<StoreState, SnackbarState, SnackbarNotification[]>(
    state => state.snackbars,
    snackbarState => snackbarState.notifications
);

let displayed = [] as string[];

const SnackbarManager = () => {
    const dispatch = useDispatch();
    const notifications = useDeepEqualSelector(selector);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const storeDisplayed = (id: string) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id: string) => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    useEffect(() => {
        notifications.forEach(({key, title, kind, dismissed = false}) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(title, {
                key,
                variant: kind,
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(SnackbarActions.removeSnackbar(myKey as string));
                    removeDisplayed(myKey as string);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
};

export default SnackbarManager;
