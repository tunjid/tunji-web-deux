import {
    CLOSE_SNACKBAR,
    ENQUEUE_SNACKBAR,
    REMOVE_SNACKBAR,
    SnackbarAction,
    SnackbarNotification
} from '../actions/Snackbar';

export interface SnackbarState {
    notifications: SnackbarNotification[];
}

export function snackbarReducer(state = {
    notifications: [] as SnackbarNotification[]
}, action: SnackbarAction) {
    switch (action.type) {
        case ENQUEUE_SNACKBAR:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        ...action.notification,
                    },
                ],
            };

        case CLOSE_SNACKBAR:
            return {
                ...state,
                notifications: state.notifications.map(notification => (
                    (action.dismissAll || notification.key === action.key)
                        ? {...notification, dismissed: true}
                        : {...notification}
                )),
            };

        case REMOVE_SNACKBAR:
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.key !== action.key,
                ),
            };

        default:
            return state;
    }
};
