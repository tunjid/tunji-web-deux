import { CallHistoryMethodAction, push, replace, goBack } from 'connected-react-router'

interface IRouterActions {
    push: (route: string) => CallHistoryMethodAction;
    replace: (route: string) => CallHistoryMethodAction;
    pop: () => CallHistoryMethodAction;
}

export type RouterAction = CallHistoryMethodAction;

export const RouterActions: IRouterActions = {
    push,
    replace,
    pop: goBack
}
