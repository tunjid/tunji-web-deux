import { DetailAction, TOGGLE_TOC } from "../actions/Detail";

export interface DetailState {
    tocOpen: boolean;
}

export function detailReducer(state = {
    tocOpen: false,
}, action: DetailAction): DetailState {
    switch (action.type) {
        case TOGGLE_TOC: {
            return {
                tocOpen: action.isOpen === undefined ? !state.tocOpen : action.isOpen,
            }
        }
    }
    return state;
}
