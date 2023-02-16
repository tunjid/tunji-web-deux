export const TOGGLE_TOC = 'TOGGLE_TOC';

export interface ToggleTOC {
    type: typeof TOGGLE_TOC;
    isOpen?: boolean;
}

export type DetailAction = ToggleTOC;

export const DetailActions = {
    toggleToc: (isOpen: boolean | undefined) => ({
        type: TOGGLE_TOC,
        isOpen
    })
};

