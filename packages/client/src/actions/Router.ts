import { NavigateFunction } from 'react-router-dom';

let navigateFunction: NavigateFunction | null = null;

export const setNavigate = (fn: NavigateFunction) => {
    navigateFunction = fn;
};

interface IRouterActions {
    push: (route: string) => () => void;
    replace: (route: string) => () => void;
    pop: () => () => void;
}

export type RouterAction = { type: '__NAVIGATION__' };

export const RouterActions: IRouterActions = {
    push: (route: string) => () => { navigateFunction?.(route); },
    replace: (route: string) => () => { navigateFunction?.(route, { replace: true }); },
    pop: () => () => { window.history.back(); },
};
