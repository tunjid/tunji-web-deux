import { CallHistoryMethodAction, push as connectedPush } from 'connected-react-router'

interface IRouterActions {
    push: (route: string) => CallHistoryMethodAction;
}

export type RouterAction = CallHistoryMethodAction;

export const RouterActions: IRouterActions = {
    push: connectedPush
}
