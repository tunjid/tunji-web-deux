import _ from 'lodash';
import { useSelector } from "react-redux";

export function useDeepEqualSelector<TState, TSelected>(selector: (state: TState) => TSelected) {
    return useSelector(selector, _.isEqual);
}
